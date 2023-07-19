 

$para1=[String]$args[0]
$para2=[String]$args[1]

"PowerShell start"
git pull
if ($para2){
    git add $para2
} else {
    git add .
}
git commit -m fix:$para1
git push
"PowerShell end"
