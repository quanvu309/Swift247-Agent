export const manifest = {
  screens: {
    scr_dxxiqf: { name: "Flow Design", route: "/", position: { "x": 0, "y": 0 }, isDefaultRow: true },
    scr_nl72pr: { name: "Executions", route: "/agent", position: { "x": 160, "y": 3800 } },
    scr_mr1607: { name: "Execution: Flagged run", route: "/agent/shp-1", position: { "x": 1560, "y": 3800 } },
    scr_uyoyk1: { name: "Execution: Cleared", route: "/agent/shp-2", position: { "x": 2960, "y": 3800 } },
    scr_eog1f2: { name: "CX approvals", route: "/ops", position: { "x": 160, "y": 5780 } },
    scr_ffozxg: { name: "Approve & send message", route: "/ops/shp-1", position: { "x": 1560, "y": 5780 } },
    scr_zrt9dy: { name: "Case: Message sent", route: "/ops/shp-4", position: { "x": 2960, "y": 5780 } },
    scr_6kxvd4: { name: "SmartKargo: Connection", route: "/smartkargo", position: { "x": 160, "y": 7760 } },
    scr_fjqey8: { name: "SmartKargo: Data sources", route: "/smartkargo", state: { "tab": "data" }, position: { "x": 2960, "y": 7760 } },
    scr_vv3jlx: { name: "SmartKargo: Sync history", route: "/smartkargo", state: { "tab": "sync" }, position: { "x": 4360, "y": 7760 } },
    scr_6vgafn: { name: "SmartKargo: Order status", route: "/smartkargo", state: { "tab": "status" }, position: { "x": 1560, "y": 7760 } },
    scr_agof5y: { name: "Orders", route: "/shipper", position: { "x": 160, "y": 1820 } },
    scr_72npz0: { name: "Order: Needs uploads", route: "/shipper/shp-4", position: { "x": 2960, "y": 1820 } },
    scr_r1g328: { name: "Order: Message to customer", route: "/shipper/shp-4", state: { "tab": "message" }, position: { "x": 4360, "y": 1820 } },
    scr_v3d5en: { name: "Order: Picked up", route: "/shipper/shp-2", position: { "x": 5760, "y": 1820 } },
    scr_gb46qh: { name: "Account: Connected accounts", route: "/account", position: { "x": 1560, "y": 9740 } },
    scr_ldqxp3: { name: "Account: Profile", route: "/account", state: { "tab": "profile" }, position: { "x": 160, "y": 9740 } },
    scr_tkgko4: { name: "Account: Team", route: "/account", state: { "tab": "team" }, position: { "x": 2960, "y": 9740 } }
  },
  sections: {
    sec_c0diy3: { name: "Shipper flow", x: 0, y: 1600, width: 7120, height: 1180 },
    sec_bfho7i: { name: "Agent flow", x: 0, y: 3580, width: 4320, height: 1180 },
    sec_zv7ltg: { name: "Ops flow", x: 0, y: 5560, width: 4320, height: 1180 },
    sec_q4xgzp: { name: "SmartKargo", x: 0, y: 7540, width: 5720, height: 1180 },
    sec_imming: { name: "Account", x: 0, y: 9520, width: 4320, height: 1180 }
  },
  layers: [
  { kind: "screen", id: "scr_dxxiqf" },
  { kind: "section", id: "sec_c0diy3", children: [
    { kind: "screen", id: "scr_agof5y" },
    { kind: "screen", id: "scr_72npz0" },
    { kind: "screen", id: "scr_r1g328" },
    { kind: "screen", id: "scr_v3d5en" }]
  },
  { kind: "section", id: "sec_bfho7i", children: [
    { kind: "screen", id: "scr_nl72pr" },
    { kind: "screen", id: "scr_mr1607" },
    { kind: "screen", id: "scr_uyoyk1" }]
  },
  { kind: "section", id: "sec_zv7ltg", children: [
    { kind: "screen", id: "scr_eog1f2" },
    { kind: "screen", id: "scr_ffozxg" },
    { kind: "screen", id: "scr_zrt9dy" }]
  },
  { kind: "section", id: "sec_q4xgzp", children: [
    { kind: "screen", id: "scr_6kxvd4" },
    { kind: "screen", id: "scr_6vgafn" },
    { kind: "screen", id: "scr_fjqey8" },
    { kind: "screen", id: "scr_vv3jlx" }]
  },
  { kind: "section", id: "sec_imming", children: [
    { kind: "screen", id: "scr_ldqxp3" },
    { kind: "screen", id: "scr_gb46qh" },
    { kind: "screen", id: "scr_tkgko4" }]
  }]

};