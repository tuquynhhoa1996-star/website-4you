(function(){
  var b=document.querySelector('.burger'),m=document.querySelector('nav.menu');
  if(b&&m){b.addEventListener('click',function(){m.classList.toggle('open');b.setAttribute('aria-expanded',m.classList.contains('open'));});}
  // Xem ảnh lớn ngay trên trang (31/10/2026: thêm nút đóng, ảnh trước/sau, phím mũi tên, vuốt), không mở sang trang ảnh riêng
  var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-label','Xem ảnh');
  lb.innerHTML='<img alt=""><button class="lb-x" type="button" aria-label="Đóng">&times;</button><button class="lb-n lb-p" type="button" aria-label="Ảnh trước">&#8249;</button><button class="lb-n lb-s" type="button" aria-label="Ảnh sau">&#8250;</button>';
  document.body.appendChild(lb);
  var ds=[],cur=0,im=lb.querySelector('img');
  function show(i){cur=(i+ds.length)%ds.length;var a=ds[cur];im.src=a.getAttribute('href');var t=a.querySelector('img');im.alt=t?t.alt:'';lb.classList.add('on');}
  function shut(){lb.classList.remove('on');}
  lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-x'))shut();});
  lb.querySelector('.lb-p').addEventListener('click',function(e){e.stopPropagation();show(cur-1);});
  lb.querySelector('.lb-s').addEventListener('click',function(e){e.stopPropagation();show(cur+1);});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')shut();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1);});
  var x0=null;lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)show(cur+(d<0?1:-1));x0=null;});
  document.querySelectorAll('.gal').forEach(function(g){var as=[].slice.call(g.querySelectorAll('a'));as.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();ds=as;show(i);});});});
})();

// bổ sung 28/10/2026: popup học thử + lọc lịch học
(function(){
  var pop=document.getElementById('pop');
  if(pop){
    var go=document.getElementById('pop-go'),sel=document.getElementById('pop-cs');
    function open(){pop.hidden=false;try{sessionStorage.setItem('pop','1');}catch(e){}}
    function close(){pop.hidden=true;}
    document.querySelectorAll('[data-pop]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();open();});});
    pop.querySelector('.pop-x').addEventListener('click',close);
    pop.addEventListener('click',function(e){if(e.target===pop)close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
    if(sel&&go){sel.addEventListener('change',function(){var b=go.getAttribute('data-base'),i=b.indexOf('#'),t='&utm_term='+encodeURIComponent(sel.value);go.href=!sel.value?b:(i<0?b+t:b.slice(0,i)+t+b.slice(i));});}
    go&&go.addEventListener('click',function(){setTimeout(close,300);});
    var seen=false;try{seen=sessionStorage.getItem('pop')==='1';}catch(e){}
    if(document.body.getAttribute('data-autopop')&&!seen&&!/[?&]nopop/.test(location.search)){setTimeout(function(){if(pop.hidden)open();},20000);}
  }
  var L=document.querySelector('.lich');
  if(L){
    var sels=L.querySelectorAll('select[data-f]'),rows=L.querySelectorAll('tbody tr'),n=L.querySelector('.lich-n');
    function f(){var v={};sels.forEach(function(s){v[s.getAttribute('data-f')]=s.value;});var c=0;
      rows.forEach(function(r){var ok=(!v.cs||r.getAttribute('data-cs')===v.cs)&&(!v.kh||r.getAttribute('data-kh')===v.kh);r.classList.toggle('hide',!ok);if(ok)c++;});
      n.textContent=c?('Đang hiện '+c+' lớp. Chọn "Tất cả" để xem lại toàn bộ.'):'Chưa có lớp khớp lựa chọn này. Gọi hotline để cô tư vấn.';}
    sels.forEach(function(s){s.addEventListener('change',f);});f();
  }
})();
// Nút Zalo (z.html, đếm lượt bấm): gắn trang hiện tại + utm/nguồn vào link (28/10/2026)
(function(){try{var S=sessionStorage,q=new URLSearchParams(location.search),m={us:'utm_source',um:'utm_medium',uc:'utm_campaign',ux:'utm_content'},k;
  for(k in m)if(q.get(m[k]))S.setItem('zl_'+k,q.get(m[k]).slice(0,100));
  var r=document.referrer;if(r&&!S.getItem('zl_ref')){try{if(new URL(r).host!==location.host)S.setItem('zl_ref',r.slice(0,200));}catch(e){}}
  var tr=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('a[href^="z.html"]').forEach(function(a){var u=a.getAttribute('href')+'&tr='+encodeURIComponent(tr);
    for(var k in m){var v=S.getItem('zl_'+k);if(v)u+='&'+k+'='+encodeURIComponent(v);}
    var f=S.getItem('zl_ref');if(f)u+='&ref='+encodeURIComponent(f);a.setAttribute('href',u);});
}catch(e){}})();

// Khung nhúng mục Giải đấu / Điểm năng lực (hoc-vien/, 28/10/2026): giữ hash của trang (link sâu), tự chỉnh chiều cao, đồng bộ hash ngược lên thanh địa chỉ.
(function(){
  var f=document.querySelector('iframe.app-nhung');if(!f)return;
  var h=location.hash&&location.hash.length>2?location.hash:f.getAttribute('data-hash');
  f.src=f.getAttribute('data-src')+h;
  function fit(){try{var d=f.contentDocument;if(!d||!d.body)return;var b=d.body,cs=d.defaultView.getComputedStyle(b);
    var hh=Math.ceil(b.getBoundingClientRect().height+parseFloat(cs.marginTop)+parseFloat(cs.marginBottom));
    if(hh>200&&Math.abs(f.offsetHeight-hh)>2)f.style.height=hh+'px';}catch(e){}}
  f.addEventListener('load',function(){fit();try{var w=f.contentWindow;
    if(w.ResizeObserver)new w.ResizeObserver(fit).observe(w.document.body);
    w.addEventListener('hashchange',function(){try{history.replaceState(null,'',location.pathname+location.search+w.location.hash);}catch(e){}
      var t=f.getBoundingClientRect().top;if(t<0)window.scrollTo(0,window.scrollY+t-80);setTimeout(fit,60);});
  }catch(e){}});
  setInterval(fit,700);
})();
