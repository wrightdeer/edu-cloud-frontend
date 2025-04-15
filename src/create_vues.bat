@echo off   
setlocal enabledelayedexpansion
   
:: 创建目录   
mkdir "views\auth" 2>nul   
mkdir "views\home" 2>nul   
mkdir "views\space" 2>nul   
mkdir "views\errors" 2>nul
   
:: 创建文件（直接指定完整路径）   
echo ^<template^>^</template^> > "views\auth\LoginView.vue"   
echo ^<template^>^</template^> > "views\home\HomeView.vue"   
echo ^<template^>^</template^> > "views\home\MaterialsView.vue"   
echo ^<template^>^</template^> > "views\home\SubjectsView.vue"   
echo ^<template^>^</template^> > "views\home\ProfileView.vue"   
echo ^<template^>^</template^> > "views\space\SpaceView.vue"   
echo ^<template^>^</template^> > "views\space\FolderListView.vue"   
echo ^<template^>^</template^> > "views\space\FilePreviewView.vue"   
echo ^<template^>^</template^> > "views\errors\NotFoundView.vue"
   
echo All files created successfully!   
pause
