var orphanRacks = {};
var gr = new GlideRecord('u_dc_rack_metadata');
gr.addEncodedQuery('u_zone=NULL');
gr.query();
while (gr.next()) {
  orphanRacks[gr.getDisplayValue('u_rack')] = gr.getValue('u_rack');
}
var urlStart = 'https://godaddydev.service-now.com/cmdb_ci_rack.do?sys_id=';
var sortedRacks = Object.keys(orphanRacks);
sortedRacks.sort();
sortedRacks.forEach(function(rackName) {
  gs.print(rackName + ' - ' + urlStart + orphanRacks[rackName])
});