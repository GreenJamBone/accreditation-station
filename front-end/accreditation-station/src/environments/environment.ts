// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const localhost = "http://localhost:3000";
export const environment = {
  production: false,
  createUser: localhost + "/api/user/create",
  allUsers: localhost + "/api/user/allUsers",
  updateUser: localhost + "/api/user/update",
  removeUser: localhost + "/api/user/remove",
  getUser: localhost + "/api/user/getUser",
  createRequirement: localhost + "/api/requirement/create",
  allRequirements: localhost + "/api/requirement/allRequirements",
  updateRequirement: localhost + "/api/requirement/update",
  removeRequirement: localhost + "/api/requirement/remove",
  createCourse: localhost + "/api/course/create",
  allCourses: localhost + "/api/course/allCourses",
  updateCourse: localhost + "/api/course/update",
  removeCourse: localhost + "/api/course/remove",
  coursesByUser: localhost + "/api/course/byuser",
  createDocument: localhost + "/api/document/create",
  allDocuments: localhost + "/api/document/allDocuments",
  updateDocument: localhost + "/api/document/update",
  removeDocument: localhost + "/api/document/remove",
  getSingleDoc: localhost + "/api/document/getDocument",
  getMultipleDocs: localhost + "/api/document/getMultipleDocs",
  createAssignment: localhost + "/api/assignment/create",
  allAssignments: localhost + "/api/assignment/allAssignments",
  updateAssignment: localhost + "/api/assignment/update",
  removeAssignment: localhost + "/api/assignment/remove",
  getAssignment: localhost + "/api/assignment/getAssignment",
  getAssignmentsByCourse: localhost + "/api/assignment/getAssignmentsByCourse",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
