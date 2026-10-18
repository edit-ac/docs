(() => {
 const gallery=document.querySelector('[data-gallery]');if(!gallery)return;
 const form=gallery.querySelector('form'),cards=[...gallery.querySelectorAll('[data-gallery-card]')];
 function filter(){const data=new FormData(form);let count=0;for(const card of cards){card.hidden=[...data].some(([key,value])=>value&&!card.dataset[key].split(' ').includes(value));if(!card.hidden)count++;}gallery.querySelector('[data-gallery-count]').textContent=`${count} ${count===1?'example':'examples'}`;}
 form.addEventListener('change',filter);form.addEventListener('submit',event=>event.preventDefault());form.addEventListener('reset',()=>setTimeout(filter,0));
 for(const button of gallery.querySelectorAll('[data-copy]'))button.addEventListener('click',async()=>{const code=document.getElementById(button.dataset.copy),status=gallery.querySelector('[data-copy-status]');try{await navigator.clipboard.writeText(code.textContent);status.textContent='Snippet copied. Full source includes imports and cleanup.';}catch{const range=document.createRange();range.selectNodeContents(code);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Clipboard unavailable. Snippet selected; use your copy shortcut.';}});
 filter();
})();
