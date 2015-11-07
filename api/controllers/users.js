/**
 * Created by ZhongyiTong on 11/8/15.
 */
"use strict";

let commons = require('./commons');
let gitlab = require('gitlab')(commons.authObj);

let users = {};

users.get = (req, res) => {
  let id = req.swagger.params.id.value;


  return new Promise((resolve, reject) => {
      if (id == 'me') {
        gitlab.users.current((user) => {
          resolve(user);
        });
      } else {
        gitlab.users.show(id, (user) => {
          resolve(user);
        });
      }
    }
  ).then((user) => {
    //let filterFactory = require('../helpers/filters');
    //let val = filterFactory.userFilter(user);
    let val =user;
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
};

module.exports = users;
