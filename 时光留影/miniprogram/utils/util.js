function formatTime(date){const y=date.getFullYear();const m=("0"+(date.getMonth()+1)).slice(-2);const d=("0"+date.getDate()).slice(-2);return y+"-"+m+"-"+d}
function formatFileSize(bytes){if(bytes<1024)return bytes+"B";if(bytes<1024*1024)return(bytes/1024).toFixed(1)+"KB";return(bytes/(1024*1024)).toFixed(1)+"MB"}
module.exports={formatTime,formatFileSize}
