'use strict';
// Datos registrados en el proyecto: masa (g) y volumen exterior (cm³).
const datos={
 'Pancacoa':{'Pequeño':[31,280.8],'Mediano':[68,898.225],'Grande':[116,1920]},
 'Cartón corrugado':{'Pequeño':[6,244],'Mediano':[11,854.854],'Grande':[19,1920]},
 'Espumaflex':{'Pequeño':[7,372],'Mediano':[14,1104],'Grande':[24,2300]}
};
// Tiempos comunicados por el equipo. No se inventan los no registrados.
const tiempos={'Pancacoa':{'Mediano':119},'Cartón corrugado':{'Pequeño':113,'Mediano':60,'Grande':34},'Espumaflex':{'Pequeño':60,'Mediano':60,'Grande':60}};
const $=id=>document.getElementById(id);
const fmt=(n,d=2)=>n.toLocaleString('es-EC',{minimumFractionDigits:d,maximumFractionDigits:d});
function render(){
 const material=$('material').value, modelo=$('modelo').value;
 const [baseMass,baseVolume]=datos[material][modelo];
 const extra=Number($('extra').value),factor=Number($('factor').value);
 const mass=baseMass+extra,volume=baseVolume*factor/100,density=mass/volume;
 const fraction=Math.min(1,density),percent=fraction*100;
 $('masaLabel').textContent=fmt(extra,0)+' g';$('volLabel').textContent=factor+' % del original';
 $('mass').textContent=fmt(mass,1)+' g';$('volume').textContent=fmt(volume,2)+' cm³';
 $('density').textContent=fmt(density,4)+' g/cm³';
 $('submerged').textContent=density<1?fmt(percent,2)+' %':'100 % (se hunde)';
 $('calculation').textContent=`${fmt(mass,1)} g ÷ ${fmt(volume,2)} cm³ = ${fmt(density,4)} g/cm³`;
 $('status').textContent=density<1?'Predicción ideal: el prisma flota':'Predicción ideal: el prisma se hunde';
 const seconds=tiempos[material]?.[modelo];
 $('observed').textContent=`${material}, modelo ${modelo}: el equipo informó que flotó.${seconds===undefined?' Tiempo de observación no registrado.':` Tiempo registrado: ${seconds} segundos.`} La estabilidad no se midió directamente.`;
 // 0% -> el prisma queda casi fuera del agua; 100% -> completamente sumergido.
 // En el dibujo el prisma tiene altura frontal de 55 px y el nivel del agua está en y=145.
 // Frente original y=118..173; ajuste para que la parte sumergida aproxime la fracción.
 const shift=145-173+55*fraction;
 // Cuando se hunde, situar el prisma cerca del fondo del recipiente.
 $('prism').setAttribute('transform',`translate(0 ${density>=1?127:shift})`);
 const colors=material==='Espumaflex'?['#e4f5fc','#f9fdff','#b4dbe9']:material==='Cartón corrugado'?['#b78e5b','#dfc69b','#8d6a43']:['#dbac67','#f4d8a2','#a87d46'];
 ['front','top','side'].forEach((id,i)=>$(id).setAttribute('fill',colors[i]));
}
['material','modelo'].forEach(id=>$(id).addEventListener('change',()=>{$('extra').value=0;$('factor').value=100;render()}));
['extra','factor'].forEach(id=>$(id).addEventListener('input',render));
$('reset').addEventListener('click',()=>{$('extra').value=0;$('factor').value=100;render()});
render();
