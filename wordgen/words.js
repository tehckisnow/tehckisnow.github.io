
let token = ", ";
let seperator = "";
let batchSize = 10;
let newline = "<br>"

function rand(top){
  return Math.floor(Math.random() * top);
};

function newBase(pre, root, suffix){
  let base = {};
  base.pre = pre.split(token);
  base.root = root.split(token);
  base.suffix = suffix.split(token);
  base.get = function(a){
    return base[a][rand(base[a].length)];
  };
  base.gen = function(){
    return base.get("pre") + seperator + base.get("root") + seperator + base.get("suffix");
  };
  return base;
};

let greek = newBase("auto, bio, geo, micro, mono, neo, pan, thermo, pol, dec, pre, phil, a, an, amphi, ana, anti, apo, ap, cata, cat, dia, di, dys, ex, ec, en, em, el, endo, ento, end, ent, ep, epi, eu, ev, exo, ecto, hyper, hypo, hyp, meta, met, palin, para, par, peri, pro, pros, syn, sym, syl, sy", "cognit, ergo, sophy, anthrop, chron, dem, morph, path, ped, pedo, philo, phil, phon", "polis, phy, en, ac, iac, al, an, ian, ic, tic, ous, ious, oid, ize, me, ma, mat, sis, se, sy, sia, y, ia, gram, graph, graphy, ast, ician, ite, ote, te, ism, ist, arch, crat, archy, cracy, ad, ics, logy, nomy, metry, arium, idium, ium, ion, isk, iscus, in, tomy, path, pathy, mania, maniac, phobia, phobe, emia, itis, ium, ism");
//let latin = newBase();

function batch(base, target){
  while(batchSize > 0){
    target.innerHTML += base.gen() + newline;
    //console.log(base.gen());
    batchSize--;
  }
};

let container = document.createElement("div");
document.body.appendChild(container);

let greekElement = document.createElement("p");
let latinElement = document.createElement("p");
container.appendChild(greekElement);
container.appendChild(latinElement);

batch(greek, greekElement);
//batch(latin, latinElement);