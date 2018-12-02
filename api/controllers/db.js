const crypto = require('crypto');
_ = require('lodash');
require('underscore-query')(_);

let db = {};

module.exports = {
  initCollection: initCollection,
  getObject: getObject,
  getObjects: getObjects,
  createObject: createObject,
  updateObject: updateObject,
  deleteObject: deleteObject,
  updateObjects: updateObjects,
};

function getRandomId() {
  return crypto.randomBytes(12).toString('hex');
}

function initCollection(collection_name) {
  db[collection_name] = [];
}

function findObject(collection_name, filter) {
  let obj = _.query(db[collection_name], filter)[0];
  if (!obj) throw new Error(
      'Object not found in collection: ' + collection_name);
  else return obj;
}

function getObject(collection_name, filter) {
  return findObject(collection_name, filter);
}

function getObjects(collection_name, filter) {
  let obj = _.query(db[collection_name], filter);
  if (!obj.length) throw new Error(
      'Object not found in collection: ' + collection_name);
  else return obj;
}

function createObject(collection_name, new_object) {
  let obj = {
    id: getRandomId(),
  };
  db[collection_name].push(Object.assign(obj, new_object));
  return {
    id: obj.id,
  };
}

function updateObject(collection_name, filter, update_object) {
  let obj = findObject(collection_name, filter);
  let index = db[collection_name].indexOf(obj);
  db[collection_name][index] = Object.assign(obj, update_object);
  return {
    id: obj.id,
  };
}

function updateObjects(collection_name, filter, update_object) {
  let objs = getObjects(collection_name, filter);
  let result = [];
  for (let objIndex in objs) {
    let obj = objs[objIndex];
    let index = db[collection_name].indexOf(obj);
    db[collection_name][index] = Object.assign(obj, update_object);
    result.push(obj.id);
  }
  return result;
}

function deleteObject(collection_name, filter) {
  let obj = findObject(collection_name, filter);
  db[collection_name].splice(db[collection_name].indexOf(obj), 1);
  return {
    id: obj.id,
  };
}
