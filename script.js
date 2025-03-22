let porsentaje_de_la_comision = 6.95;

const libres = 1;

let g = ganancia = 5.47;

const comision = (porsentaje_de_la_comision / 100) * ganancia;

ganancia = ganancia - comision;

const porcentanje_del_ahorro = 20;

let guardar = (porcentanje_del_ahorro / 100) * ganancia;

let invertir = (ganancia - guardar) - libres;

console.log (`Total $${g}  
    \n menos Comision $${comision.toFixed(2)} 
    \n igual a $${ganancia.toFixed(2)}
    \n Libres $${libres}
    \n Guardar $${guardar.toFixed(2)}
    \n e Invertir $${invertir.toFixed(2)}`
);