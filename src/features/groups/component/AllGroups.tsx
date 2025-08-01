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
    <div className="p-2 md:p-0">
      <input
        type="text"
        placeholder="Search local groups"
        className="input w-full md:w-[300px] mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
        value={searchValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchValue(e.target.value)
        }
      />
      <ul className="h-[550px] overflow-y-auto bg-white rounded-xl space-y-2 p-2">
  {filteredGroup.length > 0 ? (
    filteredGroup.map((group: Group) => (
      <li
        key={group.group_id}
        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer ${
          group.group_id === selectedGroup?.group_id
            ? "bg-gray-400"
            : "hover:bg-gray-300"
        }`}
        onClick={() => setSelectedGroup(group)}
      >
        <img
          src={group.profile_photo}
          alt={group.group_name}
          className="w-9 h-9 rounded-full ring-2 ring-red-200 cursor-pointer"
        />
        <span className="truncate">{group.group_name}</span>
      </li>
    ))
  ) : (
    <li className="text-center text-gray-400">No Group Found</li>
  )}
</ul>

    </div>
  );
}
