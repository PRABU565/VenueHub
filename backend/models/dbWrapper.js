const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

class MockModel {
  constructor(name, schemaObj) {
    this.name = name;
    this.schemaObj = schemaObj;
  }

  get data() {
    if (!global.memoryDb) {
      global.memoryDb = {};
    }
    if (!global.memoryDb[this.name]) {
      global.memoryDb[this.name] = [];
    }
    return global.memoryDb[this.name];
  }

  async find(query = {}) {
    let results = this.data.filter((item) => {
      for (let key in query) {
        const queryVal = query[key];
        const itemVal = item[key];

        if (queryVal && typeof queryVal === "object" && !Array.isArray(queryVal)) {
          // Handle operator search filters
          if (queryVal.$in) {
            const list = Array.isArray(queryVal.$in) ? queryVal.$in : [queryVal.$in];
            const strList = list.map(v => v.toString());
            if (!itemVal || !strList.includes(itemVal.toString())) return false;
          }
          if (queryVal.$gt !== undefined && !(itemVal > queryVal.$gt)) return false;
          if (queryVal.$lt !== undefined && !(itemVal < queryVal.$lt)) return false;
          if (queryVal.$gte !== undefined && !(itemVal >= queryVal.$gte)) return false;
          if (queryVal.$lte !== undefined && !(itemVal <= queryVal.$lte)) return false;
          if (queryVal.$regex !== undefined) {
            const flags = queryVal.$options || "";
            const regex = new RegExp(queryVal.$regex, flags);
            if (!itemVal || !regex.test(itemVal.toString())) return false;
          }
        } else if (queryVal !== undefined) {
          // Direct field match
          if (itemVal === undefined) return false;
          if (queryVal === null && itemVal !== null) return false;
          if (queryVal !== null && itemVal === null) return false;
          if (queryVal.toString() !== itemVal.toString()) return false;
        }
      }
      return true;
    });

    const wrappedResults = results.map((item) => this._wrapDoc(item));

    // Return array with query chain methods (sort, select, populate)
    const makeChainable = (arr) => {
      arr.populate = async function (path) {
        for (let doc of this) {
          if (doc && doc.populate) await doc.populate(path);
        }
        return this;
      };
      arr.select = function () {
        return this;
      };
      arr.sort = function (sortObj) {
        const key = Object.keys(sortObj)[0];
        const dir = sortObj[key];
        this.sort((a, b) => {
          let aVal = a[key];
          let bVal = b[key];
          if (typeof aVal === "string") aVal = aVal.toLowerCase();
          if (typeof bVal === "string") bVal = bVal.toLowerCase();
          if (aVal < bVal) return dir === -1 ? 1 : -1;
          if (aVal > bVal) return dir === -1 ? -1 : 1;
          return 0;
        });
        return this;
      };
      return arr;
    };

    return makeChainable(wrappedResults);
  }

  async findOne(query = {}) {
    const results = await this.find(query);
    return results[0] || null;
  }

  async findById(id) {
    if (!id) return null;
    return this.findOne({ _id: id.toString() });
  }

  async create(obj) {
    const newDoc = {
      _id: randomUUID(),
      ...obj,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.data.push(newDoc);
    return this._wrapDoc(newDoc);
  }

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    if (!id) return null;
    const strId = id.toString();
    const idx = this.data.findIndex((item) => item._id === strId);
    if (idx === -1) return null;

    let doc = this.data[idx];
    if (updateData.$push) {
      for (let key in updateData.$push) {
        if (!doc[key]) doc[key] = [];
        doc[key].push(updateData.$push[key]);
      }
    } else if (updateData.$pull) {
      for (let key in updateData.$pull) {
        if (doc[key]) {
          doc[key] = doc[key].filter(
            (val) => val.toString() !== updateData.$pull[key].toString()
          );
        }
      }
    } else if (updateData.$set) {
      Object.assign(doc, updateData.$set);
    } else {
      Object.assign(doc, updateData);
    }

    doc.updatedAt = new Date();
    this.data[idx] = doc;
    return this._wrapDoc(doc);
  }

  async findByIdAndDelete(id) {
    if (!id) return null;
    const strId = id.toString();
    const idx = this.data.findIndex((item) => item._id === strId);
    if (idx === -1) return null;
    const deleted = this.data.splice(idx, 1)[0];
    return this._wrapDoc(deleted);
  }

  async countDocuments(query = {}) {
    const results = await this.find(query);
    return results.length;
  }

  async deleteOne(query = {}) {
    const idx = this.data.findIndex((item) => {
      for (let key in query) {
        if (item[key]?.toString() !== query[key]?.toString()) return false;
      }
      return true;
    });
    if (idx === -1) return { deletedCount: 0 };
    this.data.splice(idx, 1);
    return { deletedCount: 1 };
  }

  _wrapDoc(rawDoc) {
    if (!rawDoc) return null;
    const doc = { ...rawDoc };

    doc.save = async () => {
      const idx = this.data.findIndex((item) => item._id === doc._id);
      doc.updatedAt = new Date();
      if (idx !== -1) {
        this.data[idx] = { ...doc };
      } else {
        this.data.push(doc);
      }
      return doc;
    };

    doc.populate = async (path) => {
      let paths = [];
      if (typeof path === "string") {
        paths = path.split(" ");
      } else if (Array.isArray(path)) {
        paths = path;
      } else if (path && typeof path === "object" && path.path) {
        paths = [path.path];
      }

      for (let p of paths) {
        if (!p) continue;
        const targetId = doc[p];
        if (!targetId) continue;

        let collection = "";
        if (p === "ownerId" || p === "userId") collection = "User";
        else if (p === "venueId") collection = "Venue";

        if (collection && global.memoryDb && global.memoryDb[collection]) {
          if (Array.isArray(targetId)) {
            doc[p] = targetId.map(
              (id) =>
                global.memoryDb[collection].find(
                  (u) => u._id === id.toString()
                ) || id
            );
          } else {
            doc[p] =
              global.memoryDb[collection].find(
                (u) => u._id === targetId.toString()
              ) || targetId;
          }
        }
      }
      return doc;
    };

    return doc;
  }
}

const createModel = (modelName, mongooseSchema) => {
  return new Proxy(
    {},
    {
      get(target, prop) {
        if (global.dbMode === "memory") {
          if (!target.mockModel) {
            target.mockModel = new MockModel(modelName, mongooseSchema.obj);
          }
          return target.mockModel[prop];
        } else {
          if (!target.mongooseModel) {
            try {
              target.mongooseModel = mongoose.model(modelName);
            } catch (e) {
              target.mongooseModel = mongoose.model(modelName, mongooseSchema);
            }
          }
          return target.mongooseModel[prop];
        }
      },
    }
  );
};

module.exports = { createModel };
