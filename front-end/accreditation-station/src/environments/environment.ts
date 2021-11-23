// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const localhost = "http://localhost:3000";
export const environment = {
  root_path: "http://csse-abet-docs.monmouth.edu:3000",
  production: false,
  createUser: "/api/user/create",
  allUsers: "/api/user/allUsers",
  updateUser: "/api/user/update",
  removeUser: "/api/user/remove",
  getUser: "/api/user/getUser",
  createRequirement: "/api/requirement/create",
  allRequirements: "/api/requirement/allRequirements",
  updateRequirement: "/api/requirement/update",
  removeRequirement: "/api/requirement/remove",
  createCourse: "/api/course/create",
  allCourses: "/api/course/allCourses",
  updateCourse: "/api/course/update",
  removeCourse: "/api/course/remove",
  coursesByUser: "/api/course/byuser",
  createDocument: "/api/document/create",
  allDocuments: "/api/document/allDocuments",
  updateDocument: "/api/document/update",
  removeDocument: "/api/document/remove",
  getSingleDoc: "/api/document/getDocument",
  getMultipleDocs: "/api/document/getMultipleDocs",
  createAssignment: "/api/assignment/create",
  allAssignments: "/api/assignment/allAssignments",
  updateAssignment: "/api/assignment/update",
  removeAssignment: "/api/assignment/remove",
  getAssignment: "/api/assignment/getAssignment",
  getAssignmentsByCourse: "/api/assignment/getAssignmentsByCourse",
  loginUser: "/api/auth",
  registerUser: "/api/user-reg",
  forgotPass: "/api/forgot-password/forgot",
  changePass: "/api/change-password",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
