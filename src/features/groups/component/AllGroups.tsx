import type { AllGroupsProps, Group } from "@/interface/interface";
import { useMemo, useState } from "react";
import { useSelectedGroupContext } from "../hook";

export function AllGroups({ groups }: AllGroupsProps) {
  const [searchValue, setSearchValue] = useState("");
  const { setSelectedGroup, selectedGroup } = useSelectedGroupContext();
  const filteredGroup = useMemo(() => {
    return groups.filter((group) =>
      group.group_name.toLocaleLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, groups]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search local groups"
        className="input"
        value={searchValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchValue(e.target.value)
        }
      />
      <ul className="w-[300px] mr-10 ml-10 h-[550px] overflow-y-auto">
        {filteredGroup.length > 0 ? (
          <>
            {filteredGroup.map((group: Group) => (
              <li
                key={group.group_id}
                className={`user-list flex items-center space-x-2 p-[5%] ml-5 mt-2 w-[80%]  cursor-pointer ${
                  group.group_id === selectedGroup?.group_id
                    ? "bg-gray-400 text-black rounded-xl"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedGroup(group)}
              >
                <img
                  src={group.profile_photo}
                  className="user-profile-image w-8 h-8 rounded-full cursor-pointer ring-2 ring-red-200"
                />
                <span className="user-name">{group.group_name}</span>
              </li>
            ))}
          </>
        ) : (
          <li className="p-5 m-5 w-[80%] text-2xl ">No Group Found</li>
        )}
      </ul>
    </div>
  );
}
