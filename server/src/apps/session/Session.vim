let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd /media/pluto/disk-archive/code/projects/interview/server/src/apps/session
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +20 /media/pluto/disk-archive/code/projects/interview/server/src/app.ts
badd +49 /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/view.ts
badd +9 /media/pluto/disk-archive/code/projects/interview/server/src/apps/students/view.ts
badd +14 /media/pluto/disk-archive/code/projects/interview/server/src/apps/students/model.ts
badd +145 /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model.ts
badd +23 /media/pluto/disk-archive/code/projects/interview/server/scripts/create.sql
badd +25 /media/pluto/disk-archive/code/projects/interview/server/src/core/BaseModel.ts
badd +8 /media/pluto/disk-archive/code/projects/interview/server/src/core/config.ts
badd +30 /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model2.ts
badd +5 /media/pluto/disk-archive/code/projects/interview/server/src/apps/auth/model.ts
badd +19 /media/pluto/disk-archive/code/projects/interview/server/src/apps/session/model.ts
badd +68 /media/pluto/disk-archive/code/projects/interview/server/src/apps/session/view.ts
badd +9 /media/pluto/disk-archive/app-data/vimwiki/default/index.wiki
badd +16 /media/pluto/disk-archive/app-data/vimwiki/default/interview\ project.wiki
argglobal
%argdel
$argadd /media/pluto/disk-archive/app-data/vimwiki/default/interview\ project.wiki
set stal=2
tabnew +setlocal\ bufhidden=wipe
tabnew +setlocal\ bufhidden=wipe
tabnew +setlocal\ bufhidden=wipe
tabnew +setlocal\ bufhidden=wipe
tabnew +setlocal\ bufhidden=wipe
tabrewind
edit /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model.ts
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 116 + 118) / 236)
exe 'vert 2resize ' . ((&columns * 119 + 118) / 236)
argglobal
balt /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model2.ts
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 160 - ((47 * winheight(0) + 29) / 58)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 160
normal! 0
wincmd w
argglobal
if bufexists(fnamemodify("/media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model.ts", ":p")) | buffer /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model.ts | else | edit /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model.ts | endif
if &buftype ==# 'terminal'
  silent file /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model.ts
endif
balt /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model2.ts
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 10 - ((9 * winheight(0) + 29) / 58)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 10
normal! 0
wincmd w
exe 'vert 1resize ' . ((&columns * 116 + 118) / 236)
exe 'vert 2resize ' . ((&columns * 119 + 118) / 236)
tabnext
edit /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/view.ts
argglobal
balt /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model.ts
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 57 - ((38 * winheight(0) + 29) / 58)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 57
normal! 034|
tabnext
edit /media/pluto/disk-archive/code/projects/interview/server/src/apps/session/view.ts
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 97 + 118) / 236)
exe 'vert 2resize ' . ((&columns * 138 + 118) / 236)
argglobal
balt /media/pluto/disk-archive/code/projects/interview/server/src/apps/session/model.ts
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 13 - ((9 * winheight(0) + 29) / 58)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 13
normal! 031|
wincmd w
argglobal
if bufexists(fnamemodify("/media/pluto/disk-archive/code/projects/interview/server/src/apps/session/view.ts", ":p")) | buffer /media/pluto/disk-archive/code/projects/interview/server/src/apps/session/view.ts | else | edit /media/pluto/disk-archive/code/projects/interview/server/src/apps/session/view.ts | endif
if &buftype ==# 'terminal'
  silent file /media/pluto/disk-archive/code/projects/interview/server/src/apps/session/view.ts
endif
balt /media/pluto/disk-archive/code/projects/interview/server/src/apps/session/model.ts
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 75 - ((18 * winheight(0) + 29) / 58)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 75
normal! 022|
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 97 + 118) / 236)
exe 'vert 2resize ' . ((&columns * 138 + 118) / 236)
tabnext
edit /media/pluto/disk-archive/code/projects/interview/server/src/core/config.ts
argglobal
balt /media/pluto/disk-archive/code/projects/interview/server/src/apps/session/view.ts
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 8 - ((7 * winheight(0) + 29) / 58)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 8
normal! 068|
tabnext
edit /media/pluto/disk-archive/code/projects/interview/server/src/apps/session/model.ts
argglobal
balt /media/pluto/disk-archive/code/projects/interview/server/src/core/config.ts
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 19 - ((18 * winheight(0) + 29) / 58)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 19
normal! 065|
tabnext
edit /media/pluto/disk-archive/code/projects/interview/server/scripts/create.sql
argglobal
balt /media/pluto/disk-archive/code/projects/interview/server/src/apps/teachers/model.ts
setlocal foldmethod=manual
setlocal foldexpr=0
setlocal foldmarker={{{,}}}
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldenable
silent! normal! zE
let &fdl = &fdl
let s:l = 23 - ((22 * winheight(0) + 29) / 58)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 23
normal! 013|
tabnext 3
set stal=1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
