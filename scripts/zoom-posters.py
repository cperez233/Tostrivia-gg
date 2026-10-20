#!/usr/bin/env python3
"""editorial-ui · Cristian Pérez · cristianperez.me
Calcula dónde cae el recorte de "Adivina el póster (detalle)" para que nunca muestre el título.
T trae, por portada, las cajas [x0, y0, x1, y1] (en %) donde hay título o texto. Para cada póster se prueban
puntos de origen del zoom y se queda con los que (1) tienen la ventana final libre de texto y (2) muestran más detalle.
Si con la escala normal no cabe, se acerca más; si ni así, el póster no lleva detalle (undertale, jurassic).
Al agregar una portada con texto, pon su caja en T y corre:  python3 scripts/zoom-posters.py
Escribe src/data/posterZoom.json  ->  { id: [escalaFinal, [[x, y], ...]] }
"""
import json,sys
import numpy as np
from PIL import Image
# cajas [x0,y0,x1,y1] en % donde hay título o texto
T={
"dragonball":[[5,76,95,94]],"onepiece":[[5,3,95,25]],"naruto":[[8,12,95,34]],"bleach":[[20,90,85,100]],"hxh":[[10,2,90,24]],"fma":[[25,74,85,93]],
"deathnote":[[3,84,97,96]],"codegeass":[[3,60,97,86]],"eva":[[3,77,97,95]],"bebop":[[10,76,95,100]],"saintseiya":[[10,77,95,96]],"sailormoon":[[3,2,97,22]],
"fairytail":[[5,78,95,100]],"digimon":[[10,9,90,30]],"yugioh":[[10,84,95,100]],"slamdunk":[[8,83,95,100]],"yuyuhakusho":[[10,70,90,100]],"inuyasha":[[10,80,95,99]],
"rurouni":[[18,84,60,98]],"ranma":[[8,5,95,26]],"doraemon":[[20,3,92,19]],"jojo":[[20,70,90,97]],"aot":[[3,37,97,62]],"tokyoghoul":[[3,77,97,95]],
"haikyuu":[[3,78,97,99]],"opm":[[3,85,97,96]],"mha":[[3,80,97,97]],"mob":[[3,80,97,100]],"kimetsu":[[30,2,85,30]],"sao":[[5,0,95,6]],
"vinland":[[3,81,97,99]],"drstone":[[3,81,97,98]],"blackclover":[[10,88,95,99]],"steinsgate":[[3,7,97,22]],"rezero":[[20,88,90,99]],"konosuba":[[3,84,97,99]],
"kaguya":[[5,78,95,94]],"jjk":[[38,50,98,64]],"csm":[[8,84,97,97]],"spyfamily":[[3,2,97,22]],"frieren":[[10,4,92,27]],"sololeveling":[[5,76,95,96]],
"dandadan":[[3,72,97,93]],"bluelock":[[3,80,97,99]],"oshinoko":[[3,84,97,99]],"bocchi":[[5,77,95,97]],"edgerunners":[[3,70,97,85]],"mario":[[30,62,97,92]],
"zelda":[[3,66,97,96]],"sonic":[[10,4,90,30]],"hollowknight":[[5,4,97,20]],"crash":[[10,4,95,26]],"portal":[[3,16,97,30]],"cuphead":[[3,7,97,44]],
"pokemon":[[8,55,95,84]],"ff":[[5,6,97,32]],"witcher":[[5,48,97,74]],"souls":[[3,6,97,24]],"genshin":[[10,84,92,99]],"cyberpunk":[[3,48,97,70]],
"kingdomhearts":[[5,26,95,46]],"persona":[[8,74,95,97]],"undertale":[[3,44,97,56]],"fallout":[[8,4,75,20]],"skyrim":[[3,28,97,72]],"gta":[[3,26,97,64]],
"rdr":[[3,78,97,99]],"minecraft":[[3,4,97,20]],"assassins":[[5,6,97,24]],"animalcrossing":[[5,0,97,16]],"stardew":[[3,6,97,40]],"terraria":[[3,78,97,99]],
"sims":[[5,30,97,60]],"gow":[[20,34,85,46]],"tlou":[[10,50,92,70]],"re":[[10,48,92,64]],"mgs":[[3,46,97,62]],"spiderman":[[10,10,92,42]],
"hades":[[3,50,97,72]],"halo":[[10,6,92,24]],"cod":[[3,6,97,20]],"fortnite":[[3,4,97,30],[3,80,40,97]],"valorant":[[3,88,97,100]],"overwatch":[[3,6,97,20]],
"counterstrike":[[3,3,97,24]],"smash":[[8,86,97,99]],"lol":[[3,80,97,99]],"amongus":[],"simpsons":[[8,4,95,27]],"breakingbad":[[3,4,70,26]],
"got":[[8,70,95,99]],"strangerthings":[[8,70,97,92]],"friends":[[5,10,97,28]],"casadepapel":[[20,10,85,34]],"chavo":[[3,3,97,32]],"theoffice":[[8,80,95,97]],
"walkingdead":[[3,16,97,34]],"merlina":[[10,76,92,94]],"avatar":[[10,6,97,38]],"peaky":[[10,76,90,99]],"rickmorty":[[3,80,97,97]],"bobesponja":[[10,4,92,32]],
"gravityfalls":[[3,8,97,32]],"adventuretime":[[15,6,90,24]],"southpark":[[10,84,95,98]],"squidgame":[[10,80,92,98]],"narcos":[[10,16,92,30],[10,46,90,64]],"betty":[[3,3,60,22]],
"theboys":[[10,70,92,92]],"hotd":[[10,66,92,92]],"himym":[[8,2,97,38]],"brooklyn99":[[3,3,97,32]],"starwars":[[8,74,95,99]],"harrypotter":[[8,3,97,28]],
"lotr":[[3,3,97,27]],"shrek":[[5,66,95,92]],"rapidos":[[10,3,60,22],[10,82,95,99]],"batman":[[20,90,80,98]],"piratas":[[3,4,97,16]],"jurassic":[[3,18,97,58]],
"matrix":[[3,83,97,99]],"indiana":[[3,3,97,28],[3,90,97,100]],
}
ids=list(T)
def win(o,s): return o*(1-1/s), o*(1-1/s)+100/s
out={};none=[]
for id in ids:
    im=np.asarray(Image.open(f"src/assets/covers/{id}.webp").convert("L").resize((200,300)),dtype=float)
    gy,gx=np.gradient(im);edge=np.hypot(gx,gy)
    got=None
    for ZT in (2.3,2.8,3.4):
        ZF=ZT*2
        cands=[]
        for ox in range(0,101,4):
            for oy in range(0,101,4):
                x0,x1=win(ox,ZT);y0,y1=win(oy,ZT)
                bad=False
                for b in T.get(id,[]):
                    ix=min(x1,b[2])-max(x0,b[0]);iy=min(y1,b[3])-max(y0,b[1])
                    if ix>1.5 and iy>1.5: bad=True;break
                if bad: continue
                a0,a1=win(ox,ZF);c0,c1=win(oy,ZF)
                sub=edge[int(c0*3):int(c1*3),int(a0*2):int(a1*2)];sub2=im[int(c0*3):int(c1*3),int(a0*2):int(a1*2)]
                cands.append((sub.mean()+0.5*sub2.std(),ox,oy))
        cands.sort(reverse=True)
        pick=[]
        for sc,ox,oy in cands:
            if sc<6: break
            if all(abs(ox-p[0])+abs(oy-p[1])>=16 for p in pick): pick.append((ox,oy,round(sc,1)))
            if len(pick)==3: break
        if pick: got=[ZT,[[p[0],p[1]] for p in pick]];break
    if got: out[id]=got
    else: none.append(id)
json.dump(out,open("src/data/posterZoom.json","w"),separators=(",",":"))
print("sin detalle:",none)
print({k:v[0] for k,v in out.items() if v[0]>2.3})
