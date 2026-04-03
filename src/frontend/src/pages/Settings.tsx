import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DEMO_USERS, useAuth } from "../context/AuthContext";
import { useSchool } from "../context/SchoolContext";
import { permissionModules } from "../data/permissions";
import { getSchoolProfile, saveSchoolProfile } from "../data/schoolProfile";
import type { Role, RolePermissions } from "../types/auth";

const ROLES: { value: Role; label: string; color: string }[] = [
  {
    value: "super_admin",
    label: "Super Admin",
    color: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  {
    value: "admin",
    label: "Admin",
    color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
  {
    value: "accountant",
    label: "Accountant",
    color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  {
    value: "librarian",
    label: "Librarian",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    value: "teacher",
    label: "Teacher",
    color: "bg-green-500/20 text-green-300 border-green-500/30",
  },
  {
    value: "parent",
    label: "Parent",
    color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    value: "student",
    label: "Student",
    color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
];

function InputField({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-gray-400 text-xs block mb-1">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
      />
    </div>
  );
}

function RolePermissionsTab({
  role,
  readOnly,
}: { role: Role; readOnly?: boolean }) {
  const { permissions, updateRolePermissions } = useAuth();
  const [localPerms, setLocalPerms] = useState<RolePermissions>(
    () => permissions[role] ?? {},
  );

  const toggle = (
    module: string,
    feature: string,
    key: keyof import("../types/auth").Permission,
  ) => {
    if (readOnly) return;
    setLocalPerms((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [feature]: {
          ...prev[module]?.[feature],
          [key]: !prev[module]?.[feature]?.[key],
        },
      },
    }));
  };

  const setAll = (val: boolean) => {
    if (readOnly) return;
    const next: RolePermissions = {};
    for (const { module, features } of permissionModules) {
      next[module] = {};
      for (const f of features) {
        next[module][f] = { view: val, add: val, edit: val, delete: val };
      }
    }
    setLocalPerms(next);
  };

  const handleSave = () => {
    updateRolePermissions(role, localPerms);
    toast.success(
      `Permissions for ${ROLES.find((r) => r.value === role)?.label} saved!`,
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {!readOnly && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-xs">
            Manage module-level access for this role
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 border-gray-600 text-gray-300"
              onClick={() => setAll(true)}
              data-ocid="permissions.button"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 border-gray-600 text-gray-300"
              onClick={() => setAll(false)}
              data-ocid="permissions.button"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
      {readOnly && (
        <div className="flex items-center gap-2">
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
            Read Only
          </Badge>
          <p className="text-gray-500 text-xs">
            Super Admin always has full access and cannot be modified.
          </p>
        </div>
      )}
      <ScrollArea className="h-[480px] rounded-lg border border-gray-700">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "#1a1f2e" }} className="sticky top-0 z-10">
              <th className="text-left px-3 py-2 text-gray-400 font-semibold w-1/2">
                Module / Feature
              </th>
              <th className="text-center px-2 py-2 text-gray-400 font-semibold">
                View
              </th>
              <th className="text-center px-2 py-2 text-gray-400 font-semibold">
                Add
              </th>
              <th className="text-center px-2 py-2 text-gray-400 font-semibold">
                Edit
              </th>
              <th className="text-center px-2 py-2 text-gray-400 font-semibold">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {permissionModules.map(({ module, features }) => (
              <>
                <tr key={`mod-${module}`} style={{ background: "#1e2535" }}>
                  <td
                    colSpan={5}
                    className="px-3 py-1.5 text-orange-400 font-semibold"
                    data-ocid="permissions.row"
                  >
                    {module}
                  </td>
                </tr>
                {features.map((feature) => {
                  const perm = localPerms[module]?.[feature] ?? {
                    view: false,
                    add: false,
                    edit: false,
                    delete: false,
                  };
                  return (
                    <tr
                      key={`${module}-${feature}`}
                      className="border-t border-gray-700/50 hover:bg-gray-800/30"
                    >
                      <td className="px-3 py-1.5 pl-6 text-gray-300">
                        {feature}
                      </td>
                      {(["view", "add", "edit", "delete"] as const).map((k) => (
                        <td key={k} className="text-center px-2 py-1.5">
                          <Checkbox
                            checked={perm[k]}
                            onCheckedChange={() => toggle(module, feature, k)}
                            disabled={readOnly}
                            className="border-gray-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            data-ocid="permissions.checkbox"
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </ScrollArea>
      {!readOnly && (
        <Button
          onClick={handleSave}
          className="self-start bg-orange-500 hover:bg-orange-600 text-white text-xs"
          data-ocid="permissions.save_button"
        >
          Save Permissions
        </Button>
      )}
    </div>
  );
}

export function Settings() {
  const [generalForm, setGeneralForm] = useState({
    schoolName: "PSM School",
    address: "123 Main Road, New Delhi - 110001",
    phone: "011-23456789",
    email: "info@psmschool.edu.in",
  });

  const [sessionForm, setSessionForm] = useState({
    session: "2025-26",
    currency: "INR (₹)",
    timezone: "Asia/Kolkata",
    admissionPrefix: "ADM",
    receiptPrefix: "RCP",
  });

  const [profile, setProfile] = useState(getSchoolProfile);
  const [newFeature, setNewFeature] = useState("");
  const [newPhoto, setNewPhoto] = useState("");
  const [activePermRole, setActivePermRole] = useState<Role>("admin");
  const {
    branches,
    activeBranch,
    setActiveBranch,
    addBranch,
    updateBranch,
    deleteBranch,
  } = useSchool();
  const [branchForm, setBranchForm] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    principal: "",
  });
  const [editingBranch, setEditingBranch] = useState<string | null>(null);

  const handleSaveGeneral = () => {
    toast.success("General settings saved!");
  };

  const handleSaveSession = () => {
    toast.success("Session settings saved!");
  };

  const handleSaveProfile = () => {
    saveSchoolProfile(profile);
    toast.success("School profile saved! Login page updated.");
  };

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-4">System Settings</h2>
      <Tabs defaultValue="general">
        <TabsList
          className="bg-gray-800 border border-gray-700 mb-4"
          data-ocid="settings.tab"
        >
          <TabsTrigger
            value="general"
            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="session"
            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Session
          </TabsTrigger>
          <TabsTrigger
            value="school-profile"
            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            School Profile
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="branches"
            className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Branches
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <div
            className="rounded-lg p-5 max-w-lg"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <h3 className="text-white text-sm font-medium mb-3">
              General Settings
            </h3>
            <div className="space-y-3">
              <InputField
                label="School Name"
                id="schoolName"
                value={generalForm.schoolName}
                onChange={(v) =>
                  setGeneralForm((p) => ({ ...p, schoolName: v }))
                }
              />
              <InputField
                label="Address"
                id="address"
                value={generalForm.address}
                onChange={(v) => setGeneralForm((p) => ({ ...p, address: v }))}
              />
              <InputField
                label="Phone"
                id="phone"
                value={generalForm.phone}
                onChange={(v) => setGeneralForm((p) => ({ ...p, phone: v }))}
              />
              <InputField
                label="Email"
                id="email"
                value={generalForm.email}
                onChange={(v) => setGeneralForm((p) => ({ ...p, email: v }))}
              />
            </div>
            <Button
              onClick={handleSaveGeneral}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white text-xs"
              data-ocid="settings.save_button"
            >
              Save Settings
            </Button>
          </div>
        </TabsContent>

        {/* Session Tab */}
        <TabsContent value="session">
          <div
            className="rounded-lg p-5 max-w-lg"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <h3 className="text-white text-sm font-medium mb-3">
              Session Settings
            </h3>
            <div className="space-y-3">
              <InputField
                label="Academic Session"
                id="session"
                value={sessionForm.session}
                onChange={(v) => setSessionForm((p) => ({ ...p, session: v }))}
              />
              <InputField
                label="Currency"
                id="currency"
                value={sessionForm.currency}
                onChange={(v) => setSessionForm((p) => ({ ...p, currency: v }))}
              />
              <InputField
                label="Timezone"
                id="timezone"
                value={sessionForm.timezone}
                onChange={(v) => setSessionForm((p) => ({ ...p, timezone: v }))}
              />
              <InputField
                label="Admission No Prefix"
                id="admissionPrefix"
                value={sessionForm.admissionPrefix}
                onChange={(v) =>
                  setSessionForm((p) => ({ ...p, admissionPrefix: v }))
                }
              />
              <InputField
                label="Receipt No Prefix"
                id="receiptPrefix"
                value={sessionForm.receiptPrefix}
                onChange={(v) =>
                  setSessionForm((p) => ({ ...p, receiptPrefix: v }))
                }
              />
            </div>
            <Button
              onClick={handleSaveSession}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white text-xs"
              data-ocid="settings.save_button"
            >
              Save Settings
            </Button>
          </div>
        </TabsContent>

        {/* School Profile Tab */}
        <TabsContent value="school-profile">
          <div
            className="rounded-lg p-5 max-w-2xl space-y-4"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <h3 className="text-white text-sm font-medium">
              School Profile (controls Login Page)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="School Name"
                id="pSchoolName"
                value={profile.schoolName}
                onChange={(v) => setProfile((p) => ({ ...p, schoolName: v }))}
              />
              <InputField
                label="Tagline"
                id="pTagline"
                value={profile.tagline}
                onChange={(v) => setProfile((p) => ({ ...p, tagline: v }))}
              />
              <InputField
                label="Phone"
                id="pPhone"
                value={profile.phone}
                onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
              />
              <InputField
                label="Email"
                id="pEmail"
                value={profile.email}
                onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
              />
            </div>
            <div>
              <label
                htmlFor="pAddress"
                className="text-gray-400 text-xs block mb-1"
              >
                Address
              </label>
              <input
                id="pAddress"
                value={profile.address}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, address: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
              />
            </div>

            {/* Features */}
            <div>
              <p className="text-gray-400 text-xs mb-2">School Features</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.features.map((feat, i) => (
                  <div
                    key={feat}
                    className="flex items-center gap-1 bg-gray-700/50 rounded-full px-2 py-1"
                    data-ocid={`profile.item.${i + 1}`}
                  >
                    <span className="text-gray-200 text-xs">{feat}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setProfile((p) => ({
                          ...p,
                          features: p.features.filter((_, j) => j !== i),
                        }))
                      }
                      className="text-gray-500 hover:text-red-400"
                      data-ocid={`profile.delete_button.${i + 1}`}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature..."
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
                  data-ocid="profile.input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newFeature.trim()) {
                      setProfile((p) => ({
                        ...p,
                        features: [...p.features, newFeature.trim()],
                      }));
                      setNewFeature("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newFeature.trim()) {
                      setProfile((p) => ({
                        ...p,
                        features: [...p.features, newFeature.trim()],
                      }));
                      setNewFeature("");
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded px-2 py-1 text-xs"
                  data-ocid="profile.button"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Photo URLs */}
            <div>
              <p className="text-gray-400 text-xs mb-2">
                Photo Gallery URLs (login page carousel)
              </p>
              <div className="space-y-1.5 mb-2">
                {profile.photos.map((url, i) => (
                  <div
                    key={url}
                    className="flex items-center gap-2"
                    data-ocid={`gallery.item.${i + 1}`}
                  >
                    <span className="text-gray-400 text-xs flex-1 truncate">
                      {url}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setProfile((p) => ({
                          ...p,
                          photos: p.photos.filter((_, j) => j !== i),
                        }))
                      }
                      className="text-gray-500 hover:text-red-400"
                      data-ocid={`gallery.delete_button.${i + 1}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  placeholder="Paste photo URL..."
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-green-500"
                  data-ocid="gallery.input"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPhoto.trim()) {
                      setProfile((p) => ({
                        ...p,
                        photos: [...p.photos, newPhoto.trim()],
                      }));
                      setNewPhoto("");
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded px-2 py-1 text-xs"
                  data-ocid="gallery.button"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
              data-ocid="profile.save_button"
            >
              Save Profile
            </Button>
          </div>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="permissions">
          <div
            className="rounded-lg p-5"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <h3 className="text-white text-sm font-medium mb-4">
              Roles & Permissions
            </h3>
            <Tabs
              value={activePermRole}
              onValueChange={(v) => setActivePermRole(v as Role)}
            >
              <TabsList
                className="bg-gray-800 border border-gray-700 flex-wrap h-auto gap-1 mb-4"
                data-ocid="permissions.tab"
              >
                {ROLES.map((r) => (
                  <TabsTrigger
                    key={r.value}
                    value={r.value}
                    className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    {r.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {ROLES.map((r) => (
                <TabsContent key={r.value} value={r.value}>
                  <RolePermissionsTab
                    role={r.value}
                    readOnly={r.value === "super_admin"}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <div
            className="rounded-lg p-5"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <h3 className="text-white text-sm font-medium mb-4">
              User Accounts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-3 text-gray-400">Name</th>
                    <th className="text-left py-2 px-3 text-gray-400">
                      User ID
                    </th>
                    <th className="text-left py-2 px-3 text-gray-400">
                      Password
                    </th>
                    <th className="text-left py-2 px-3 text-gray-400">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_USERS.map((u, i) => {
                    const roleInfo = ROLES.find((r) => r.value === u.role);
                    return (
                      <tr
                        key={u.userId}
                        className="border-t border-gray-700/50 hover:bg-gray-800/30"
                        data-ocid={`users.row.${i + 1}`}
                      >
                        <td className="py-2 px-3 text-white">{u.name}</td>
                        <td className="py-2 px-3 font-mono text-blue-300">
                          {u.userId}
                        </td>
                        <td className="py-2 px-3 font-mono text-gray-400">
                          {u.password}
                        </td>
                        <td className="py-2 px-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 border ${roleInfo?.color}`}
                          >
                            {roleInfo?.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="branches">
          <div
            className="rounded-lg p-5 max-w-3xl"
            style={{ background: "#1a1f2e", border: "1px solid #374151" }}
          >
            <h3 className="text-white font-semibold text-sm mb-4">
              School Branches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label
                  htmlFor="branch-name"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Branch Name *
                </label>
                <input
                  id="branch-name"
                  value={
                    editingBranch
                      ? (branches.find((b) => b.id === editingBranch)?.name ??
                        branchForm.name)
                      : branchForm.name
                  }
                  onChange={(e) => {
                    if (editingBranch) {
                      const b = branches.find((x) => x.id === editingBranch);
                      if (b) updateBranch({ ...b, name: e.target.value });
                    } else {
                      setBranchForm((f) => ({ ...f, name: e.target.value }));
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-orange-500"
                  placeholder="e.g. North Campus"
                  data-ocid="branches.input"
                />
              </div>
              <div>
                <label
                  htmlFor="branch-principal"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Principal Name
                </label>
                <input
                  id="branch-principal"
                  value={
                    editingBranch
                      ? (branches.find((b) => b.id === editingBranch)
                          ?.principal ?? branchForm.principal)
                      : branchForm.principal
                  }
                  onChange={(e) => {
                    if (editingBranch) {
                      const b = branches.find((x) => x.id === editingBranch);
                      if (b) updateBranch({ ...b, principal: e.target.value });
                    } else {
                      setBranchForm((f) => ({
                        ...f,
                        principal: e.target.value,
                      }));
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-orange-500"
                  placeholder="Principal name"
                  data-ocid="branches.input"
                />
              </div>
              <div>
                <label
                  htmlFor="branch-address"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Address
                </label>
                <input
                  id="branch-address"
                  value={
                    editingBranch
                      ? (branches.find((b) => b.id === editingBranch)
                          ?.address ?? branchForm.address)
                      : branchForm.address
                  }
                  onChange={(e) => {
                    if (editingBranch) {
                      const b = branches.find((x) => x.id === editingBranch);
                      if (b) updateBranch({ ...b, address: e.target.value });
                    } else {
                      setBranchForm((f) => ({ ...f, address: e.target.value }));
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-orange-500"
                  placeholder="Branch address"
                  data-ocid="branches.input"
                />
              </div>
              <div>
                <label
                  htmlFor="branch-contact"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Contact
                </label>
                <input
                  id="branch-contact"
                  value={
                    editingBranch
                      ? (branches.find((b) => b.id === editingBranch)
                          ?.contact ?? branchForm.contact)
                      : branchForm.contact
                  }
                  onChange={(e) => {
                    if (editingBranch) {
                      const b = branches.find((x) => x.id === editingBranch);
                      if (b) updateBranch({ ...b, contact: e.target.value });
                    } else {
                      setBranchForm((f) => ({ ...f, contact: e.target.value }));
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-orange-500"
                  placeholder="Phone number"
                  data-ocid="branches.input"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="branch-email"
                  className="text-gray-400 text-xs block mb-1"
                >
                  Email
                </label>
                <input
                  id="branch-email"
                  value={
                    editingBranch
                      ? (branches.find((b) => b.id === editingBranch)?.email ??
                        branchForm.email)
                      : branchForm.email
                  }
                  onChange={(e) => {
                    if (editingBranch) {
                      const b = branches.find((x) => x.id === editingBranch);
                      if (b) updateBranch({ ...b, email: e.target.value });
                    } else {
                      setBranchForm((f) => ({ ...f, email: e.target.value }));
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-white text-xs outline-none focus:border-orange-500"
                  placeholder="branch@school.edu.in"
                  data-ocid="branches.input"
                />
              </div>
            </div>
            <div className="flex gap-2 mb-5">
              {editingBranch ? (
                <>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7"
                    onClick={() => {
                      setEditingBranch(null);
                      toast.success("Branch updated");
                    }}
                    data-ocid="branches.save_button"
                  >
                    Update Branch
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white text-xs h-7"
                    onClick={() => setEditingBranch(null)}
                    data-ocid="branches.cancel_button"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs h-7"
                  onClick={() => {
                    if (!branchForm.name.trim()) {
                      toast.error("Branch name is required");
                      return;
                    }
                    addBranch(branchForm);
                    setBranchForm({
                      name: "",
                      address: "",
                      contact: "",
                      email: "",
                      principal: "",
                    });
                    toast.success("Branch added");
                  }}
                  data-ocid="branches.primary_button"
                >
                  <Plus size={12} className="mr-1" /> Add Branch
                </Button>
              )}
            </div>
            <div className="overflow-hidden rounded border border-gray-700">
              <table className="w-full text-xs" data-ocid="branches.table">
                <thead>
                  <tr style={{ background: "#111827" }}>
                    <th className="text-left px-3 py-2 text-gray-400 font-medium">
                      Branch Name
                    </th>
                    <th className="text-left px-3 py-2 text-gray-400 font-medium hidden sm:table-cell">
                      Principal
                    </th>
                    <th className="text-left px-3 py-2 text-gray-400 font-medium hidden md:table-cell">
                      Contact
                    </th>
                    <th className="text-left px-3 py-2 text-gray-400 font-medium">
                      Status
                    </th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {branches.map((b, i) => (
                    <tr
                      key={b.id}
                      style={{
                        borderTop: "1px solid #374151",
                        background: i % 2 === 0 ? "#0f1117" : "#111827",
                      }}
                      data-ocid={`branches.item.${i + 1}`}
                    >
                      <td className="px-3 py-2 text-white font-medium">
                        {b.name}
                      </td>
                      <td className="px-3 py-2 text-gray-300 hidden sm:table-cell">
                        {b.principal || "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-300 hidden md:table-cell">
                        {b.contact || "—"}
                      </td>
                      <td className="px-3 py-2">
                        {activeBranch?.id === b.id ? (
                          <span className="text-green-400 text-[10px] font-semibold">
                            ● Active
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveBranch(b);
                              toast.success(`Switched to ${b.name}`);
                            }}
                            className="text-blue-400 text-[10px] hover:underline"
                            data-ocid="branches.toggle"
                          >
                            Set Active
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingBranch(b.id)}
                            className="text-blue-400 hover:text-blue-300 text-[10px]"
                            data-ocid={`branches.edit_button.${i + 1}`}
                          >
                            Edit
                          </button>
                          {b.id !== "main" && (
                            <button
                              type="button"
                              onClick={() => {
                                deleteBranch(b.id);
                                toast.success("Branch deleted");
                              }}
                              className="text-red-400 hover:text-red-300 text-[10px]"
                              data-ocid={`branches.delete_button.${i + 1}`}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
