  
var deployConfig = require('config').get('deploy')
var FtpDeploy = require('ftp-deploy')
var ftpDeploy = new FtpDeploy()
const path = require('path')

var config = {
  user: deployConfig.get('username'),
  password: deployConfig.get('password'), // optional, prompted if none given
  host: deployConfig.get('host'),
  port: deployConfig.get('port'),
  localRoot: path.join(__dirname, deployConfig.get('localRoot')),
  remoteRoot: deployConfig.get('remoteRoot'),
  include: deployConfig.get('include'),
  deleteRemote: deployConfig.get('deleteRemote'),
  forcePasv: deployConfig.get('forcePasv')
}

ftpDeploy
  .deploy(config)
  .then(res => console.log("finished:", res))
  .catch(err => console.log(err));

ftpDeploy.on("uploading", function(data) {
  data.totalFilesCount; // total file count being transferred
  data.transferredFileCount; // number of files transferred
  data.filename; // partial path with filename being uploaded
});
ftpDeploy.on("uploaded", function(data) {
  console.log(`${data.filename} (${data.transferredFileCount}/${data.totalFilesCount})`)
});
ftpDeploy.on("log", function(data) {
  console.log(data); // same data as uploading event
});
ftpDeploy.on("upload-error", function(data) {
  console.log(data.err); // data will also include filename, relativePath, and other goodies
});