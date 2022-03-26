var roomName = 'N3SB';
var roomSysId = '';
// find the sys_id of the room
var grRoom = new GlideRecord('cmdb_ci_computer_room');
grRoom.addQuery('name', roomName);
grRoom.query();
while (grRoom.next()) {
  roomSysId = grRoom.getUniqueValue();
}
// get the sys_ids of zones parented to the room
var zoneCiList = [];
var grZone = new GlideRecord('cmdb_rel_ci');
grZone.addQuery('type', 'e81e87c30a0a0aa7002dd03d09af0f6a');
grZone.addQuery('parent.sys_id', roomSysId);
grZone.query();
while (grZone.next()) {
  zoneCiList.push(grZone.getValue('child'));
}
// get sys_ids of racks parented to zones 
var rackCiList = [];
var grRack = new GlideRecord('cmdb_rel_ci');
grRack.addQuery('type', 'e7f235380a0a0aa7000e410d8c6a9a54');
grRack.addQuery('parent.sys_id', 'IN', zoneCiList);
grRack.query();
while (grRack.next()) {
  rackCiList.push(grRack.getValue('child'));
}
// find CIs parented to the rack
var ciList = [];
var grMounted = new GlideRecord('cmdb_rel_ci');
grMounted.addQuery('type', 'e76b8c7b0a0a0aa70082c9f7c2f9dc64');
grMounted.addQuery('parent.sys_id', 'IN', rackCiList);
grMounted.query();
while (grMounted.next()) {
  ciList.push(grMounted.getValue('child'));
}
// find CIs parented to the above CIs
var grSled = new GlideRecord('cmdb_rel_ci');
grSled.addQuery('type', '55c95bf6c0a8010e0118ec7056ebc54d');
grSled.addQuery('parent.sys_id', 'IN', ciList);
grSled.query();
while (grSled.next()) {
  ciList.push(grSled.getValue('child'));
}
// find the CIs that do not are not installed
var susList = [];
var grCmdbCi = new GlideRecord('cmdb_ci');
grCmdbCi.addQuery('sys_id', 'IN', ciList);
grCmdbCi.query();
while (grCmdbCi.next()) {
  if (grCmdbCi.getValue('install_status') !== '1') {
    susList.push('https://godaddy.service-now.com/cmdb_ci.do?sys_id=' + grCmdbCi.getUniqueValue());
  }
}
gs.print('Number of suspicious CIs found = ' + susList.length);
gs.print(susList);