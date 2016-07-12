;--------------------------------
; Environment
    
    !define VERSION "{{{VERSION #}}}"
    
;--------------------------------
; General

    ;Name and file
    Name "Swig ${VERSION}"
    OutFile "swig-installer.exe"
    Icon "swig.ico"
    
    ; Default installation directory
    installDir "$PROGRAMFILES\swig\"

    RequestExecutionLevel admin

;--------------------------------
; Pages
    Page directory
    Page instfiles
    
    UninstPage uninstConfirm
    UninstPage instfiles

;--------------------------------
; Installer Sections
Section "install"
    
; Add files
    SetOutPath "$INSTDIR"
    
        File "content_resources_200_percent.pak"
        File "content_shell.pak"
        File "d3dcompiler_47.dll"
        File "ffmpeg.dll"
        File "icudtl.dat"
        File "libEGL.dll"
        File "libGLESv2.dll"
        File "natives_blob.bin"
        File "node.dll"
        File "snapshot_blob.bin"
        File "swig.exe"
        File "version"
        File "ui_resources_200_percent.pak"
        File "xinput1_3.dll"
        
    SetOutPath "$INSTDIR\resources"
    
        File "resources\app.asar"
        File "resources\electron.asar"
        
    SetOutPath "$INSTDIR\locales"
    
        File "locales\en-US.pak"
    
; Create desktop shortcut
    CreateShortCut "$DESKTOP\swig.lnk" "$INSTDIR\swig.exe"
    
; Create uninstaller
    WriteUninstaller "$INSTDIR\uninstall.exe"
    
SectionEnd


;--------------------------------
; Uninstaller
Section "uninstall"
    
; Delete files
    RMDir /r "$INSTDIR\*.*"
    
; Remove the installation directory
    RMDir "$INSTDIR"
    
SectionEnd
