// /stores/group-store.ts

import {create} from 'zustand';
import {Group} from "@/src/features/groups/types";

type GroupStore = {
    group: Group|null;
    setGroup: (group:Group|null) => void;
};

export const useGroupStore = create<GroupStore>((set) => ({
    group: null,
    setGroup: (newGroup) => set({group: newGroup}),
}));