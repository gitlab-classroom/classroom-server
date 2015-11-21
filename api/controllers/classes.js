/**
 * Created by ZhongyiTong on 11/7/15.
 */
"use strict";

let apiwrap = require('./apibase').apiwrap;

let classes = {};

let assignmentsFilter = require('../filters/assignments');
let classesFilter = require('../filters/classes');
let materialsFilter = require('../filters/materials');
let membersFilter = require('../filters/members');
let noticesFilter = require('../filters/notices');
let activitiesFilter = require('../filters/activities');

classes.listAll = apiwrap((req, res, gitlab) => {
  return new Promise((resolve, reject) => {
      gitlab.groups.all((groups) => {
        resolve(classesFilter.parseClasses(groups));
      });
    }
  ).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.get = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.show(id, function (group) {
        resolve(classesFilter.parseClass(group));
      });
    }
  ).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listAssignments = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        resolve(assignmentsFilter.parseAssignments(projects));
      });
    }
  ).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listMaterials = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            resolve(project);
            return;
          }
        }
      });
    }
  ).then((syllabus)=> {
    return new Promise((resolve, reject) => {
      gitlab.projects.repository.listTree(syllabus.id, function (list) {
        resolve(materialsFilter.parseMaterials(list, syllabus.web_url, syllabus.default_branch));
      });
    });
  }).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listMembers = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listMembers(id, function (members) {
        resolve(membersFilter.parseMembers(members));
      });
    }
  ).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listNotices = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            resolve(project);
            return;
          }
        }
      });
    }
  ).then((syllabus)=> {
    return new Promise((resolve, reject) => {
        gitlab.projects.issues.list(syllabus.id, function (issues) {
          resolve(noticesFilter.parseNotices(issues));
        });
      }
    )
  }).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

// TODO: unfinished work
classes.getNotice = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  let iid = req.swagger.params.iid.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            resolve(project);
            return;
          }
        }
      });
    }
  ).then((syllabus)=> {
    return new Promise((resolve, reject) => {
        gitlab.projects.issues.notes.all(syllabus.id, iid, function (issue) {
          console.log(iid);
          resolve(noticesFilter.parseNoticeDetail(issue));
        });
      }
    ).then((val)=> {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(val));
      res.end();
    });
  })
});

classes.listActivities = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            let activitiesObj = {'syllabus': project, 'assignments': projects};
            resolve(activitiesObj);
          }
        }
      });
    }
  ).then((activitiesObj)=> {
    return new Promise((resolve, reject) => {
        gitlab.projects.issues.list(activitiesObj.syllabus.id, function (issues) {
          activitiesObj.notices = issues;
          resolve(activitiesFilter.parseActivities(activitiesObj));
        });
      }
    )
  }).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

module.exports = classes;
