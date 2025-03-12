const classesURL =
  "https://dncv5vxdy4n7ia2xzopcmycjfu0naklu.lambda-url.us-east-1.on.aws/";
const descendantURL =
  "https://rcczhenmj6dytnj5q332iopjie0uklsk.lambda-url.us-east-1.on.aws/";
const ancestorURL =
  "https://36vebz5yqtvyzbhk4dcbbw4l7m0qkvxk.lambda-url.us-east-1.on.aws/";

export function getClassList(setData) {
  return fetch(`${classesURL}`)
    .then((response) =>
      response.ok ? response.json() : Promise.reject("Failed to fetch")
    )
    .then((data) => {
      console.log("Setting class list", data.query);
      setData(data.query);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function getDescendants(setDescendants) {
  return fetch(`${descendantURL}`)
    .then((response) =>
      response.ok ? response.json() : Promise.reject("Failed to fetch")
    )
    .then((data) => {
      console.log("Setting descendants list");

      // Transform data.query into an object with Sets
      const descendantMap = {};
      data.query.forEach((cls) => {
        if (!descendantMap[cls.class_id]) {
          descendantMap[cls.class_id] = new Set();
        }
        descendantMap[cls.class_id].add(cls.descendant_classID);
      });

      setDescendants(descendantMap); // Store the object of Sets in state
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function getAncestors(setAncestors) {
  return fetch(`${ancestorURL}`)
    .then((response) =>
      response.ok ? response.json() : Promise.reject("Failed to fetch")
    )
    .then((data) => {
      console.log("Setting ancestors list");

      // Transform data.query into an object with Sets
      const ancestorMap = {};
      data.query.forEach((cls) => {
        if (!ancestorMap[cls.class_id]) {
          ancestorMap[cls.class_id] = new Set();
        }
        ancestorMap[cls.class_id].add(cls.ancestor_classID);
      });

      setAncestors(ancestorMap); // Store the object of Sets in state
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
