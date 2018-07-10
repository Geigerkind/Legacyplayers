for /r %%i in (viewer\*.png) do zopflipng --iterations=500 --splitting=3 --filters=01234mepb --lossy_8bit --lossy_transparent -y %%i %%i

PAUSE