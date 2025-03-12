import { useEffect, useState } from "react";
import { getAncestors, getDescendants } from "../../services/getProgram";

function ShowClasses({ classList }) {
  const [isStarted, setStart] = useState(false);
  const [clsDescendants, setDescendants] = useState([]); //Descendants are the list of classes that later require them
  const [clsAncestors, setAncestors] = useState([]); //Ancestors are classes' pre-requisites
  const [availableClasses, setAvailableClasses] = useState(new Set());
  const [takenClasses, setTaken] = useState(new Set());

  console.log("This is the classes list", classList);
  console.log("This is the ancestor list", clsAncestors);
  console.log("This is the descendants list", clsDescendants);

  //Retrieves ancestors list
  useEffect(() => {
    getAncestors(setAncestors);
  }, [classList]);

  //Retrieves descendants list
  useEffect(() => {
    getDescendants(setDescendants);
  }, [classList]);

  //Sets available classes only once ancestors are fetched.
  useEffect(() => {
    setAvailableClasses(() => {
      const available = new Set();
      Object.keys(clsAncestors).forEach((key) => {
        if (clsAncestors[key].has(-1)) {
          available.add(Number(key));
        }
      });

      console.log("This is the availability list", available);
      return available;
    });
  }, [clsAncestors]);

  const handleStart = (e) => {
    console.log("You've started the program!");
    setStart(true);
  };

  const handleDelete = (classId, prevSet) => {
    prevSet.delete(classId);
    clsDescendants[classId].forEach((descCls) => {
      console.log("This is the descCls", descCls);
      //We guarantee that the descendants of this clicked class will no longer have all ancestor classes
      //taken since this by definition this class is its own descendants ancestor

      if (availableClasses.has(descCls)) {
        availableClasses.delete(descCls);
        handleDelete(descCls, prevSet);
      }
      return;
    });
    // clsDescendants[classId].forEach((descCls) => {
    //   console.log("This is the descCls", descCls);
    //   //We guarantee that the descendants of this clicked class will no longer have all ancestor classes
    //   //taken since this by definition this class is its own descendants ancestor

    //   if (prevSet.has(descCls)) {
    //     prevSet.delete(descCls);
    //     handleDelete(descCls, prevSet);
    //   }
    //   return; //Base case: no deletion
    // });
  };

  const handleClick = (classId) => {
    //Available classes should be marked as taken or unticked if already taken
    if (!isStarted || !availableClasses.has(classId)) return;
    setTaken((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        handleDelete(classId, newSet);
      } else {
        newSet.add(classId);

        //Class has been taken, check its descendants to view new available classes
        //For each descendant, find its ancestors
        clsDescendants[classId].forEach((descCls) => {
          console.log("This is the descCls", descCls);
          let isAllPrereqTaken = true;

          //Check whether the future class now has all of it's classes taken
          if (!clsDescendants[classId].has(-1)) {
            clsAncestors[descCls].forEach((checkedCls) => {
              console.log("This is the checkedClass", checkedCls);
              if (!newSet.has(checkedCls)) {
                console.log("Checked class has pre-reqs left");
                isAllPrereqTaken = false;
              }
            });

            if (isAllPrereqTaken) {
              availableClasses.add(descCls);
              console.log("This is the new available list", availableClasses);
            }
          }
        });
      }
      return newSet;
    });
  };

  console.log("This is the currently taken classes", takenClasses);
  return (
    <div id="class_list" className="flex-container">
      <div className="column1">
        {classList.map((cls) => (
          <div
            key={cls.class_id}
            id={cls.class_id}
            className={`lesson 
              ${availableClasses.has(cls.class_id) ? "available" : ""} 
              ${takenClasses.has(cls.class_id) ? "taken" : ""}`}
            onClick={() => {
              handleClick(cls.class_id);
            }}
          >
            {cls.name}
          </div>
        ))}
      </div>
      <div className="column2">
        <button id="start_btn" onClick={handleStart}>
          Start
        </button>
      </div>
    </div>
  );
}

export default ShowClasses;
