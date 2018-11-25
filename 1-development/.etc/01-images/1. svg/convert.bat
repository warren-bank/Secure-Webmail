@echo off

set inkscape="C:\PortableApps\Inkscape\InkscapePortable.exe"

set file_src="%~dp0.\secure_webmail_480x480.svg"
set dir_dst=%~dp0..\2. crops

call :do_conversion  "32"
call :do_conversion  "48"
call :do_conversion  "96"
call :do_conversion "128"

goto :done

:do_conversion
  set size=%~1
  set file_dst="%dir_dst%\secure_webmail_%size%x%size%.png"
  %inkscape% --without-gui --export-png=%file_dst% --export-width=%size% --export-height=%size% --export-background-opacity=0 %file_src%
  goto :eof

:done
