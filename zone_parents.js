var dodgyRacks = {};
var parentCount = {};
var sysIdName = {};
// get all racks
var grRack = new GlideRecord('cmdb_ci_rack');
grRack.query();
while (grRack.next()) {
  sysIdName[grRack.getUniqueValue()] = grRack.getDisplayValue();
  parentCount[grRack.getUniqueValue()] = 0;
}
// find parent relationships and generate count per rack
var grParent = new GlideRecord('cmdb_rel_ci');
grParent.addQuery('child', Object.keys(sysIdName));
grParent.addQuery('type', 'e7f235380a0a0aa7000e410d8c6a9a54');
grParent.query();
while (grParent.next()) {
  if (Object.prototype.hasOwnProperty.call(parentCount, grParent.getValue('child'))) {
    parentCount[grParent.getValue('child')] += 1;
  } else {
    gs.error('rack sys_id ' + grParent.getValue('child') + ' not found in parentCount');
  }
}
// find the racks where the number of parents is not one
Object.keys(parentCount).forEach(function (rackSysId) {
  if (parentCount[rackSysId] !== 1) {
    if (Object.prototype.hasOwnProperty.call(sysIdName, rackSysId)) {
      dodgyRacks[sysIdName[rackSysId]] = parentCount[rackSysId];
    } else {
      gs.error('rack sys_id ' + grParent.getValue('child') + ' not found in sysIdName');
    }
  }
});
gs.print(dodgyRacks);
var dodgyRackCount = Object.keys(dodgyRacks).length;
var totalRackCount = Object.keys(sysIdName).length;
var percentageBad = (dodgyRackCount / totalRackCount) * 100;
gs.print('Number of racks with issues = ' + dodgyRackCount.toString());
gs.print('Percentage of racks with issues = ' + percentageBad.toFixed(2) + '%');