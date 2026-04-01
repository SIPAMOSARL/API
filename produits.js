const products = [
  { 
    id: 1, 
    name: "Chemise Col Mao", 
    price: 8500, 
    oldPrice: null, 
    category: "homme", 
    subcategory: "Chemises",
    type: ["chemise-longues-manches"],  // ← 2 types !
    images: ["images/chemise belge a.webp", "images/chemise belge.webp", "images/chemise bordeaux.webp", "images/chemise bordeaux a.webp", "images/chemise noir.webp","images/chemise noir a.webp", "images/chemise bleu a.webp", "images/chemise bleu.webp"], 
    desc: "Propulsez votre carrière vers de nouveaux sommets avec la collection Executive de SIPAMO, une gamme de chemises conçue pour l'homme d'affaires ambitieux qui considère son image comme un levier stratégique de sa réussite financière. Chaque pièce, du col officier moderne aux manchettes contrastées, est pensée pour projeter une autorité naturelle et une assurance immédiate lors de vos négociations les plus décisives. En choisissant ces modèles aux motifs structurants, qu'il s'agisse des rayures verticales qui imposent le respect ou du pied-de-poule sophistiqué, vous ne vous contentez pas de vous habiller : vous investissez dans un capital visuel qui forge votre crédibilité, renforce votre confiance et attire les opportunités de haute volée.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["noir", "beige", "bleu nuit", "bordeaux"],
    colorStock: { "noir": 3, "bleu nuit": 0, "bordeaux": 3, "beige": 4},
    specs: {
      stock: "10 articles disponibles",
      material: "satin, gabardine premium",
      finish: "Coutures renforcées, Boutons nacrés",
      care: "Lavage à 30°C, repassage modéré"
    }
  },
  { 
    id: 2, 
    name: "Chemise Sans Col", 
    price: 3500, 
    oldPrice: 5500, 
    category: "homme", 
    subcategory: "Chemises",
    type: "chemise-courtes-manches",
    images: ["images/chemise sans col grise.webp"], 
    desc: "Coton solide mélangé respirant. Boutons nacrés dissimulés.",
    sizes: ["M", "L", "XL"],
    colors: ["gris", "blanc", "noir"],
    colorStock: { "gris": 4, "blanc": 2, "noir": 2 },
    specs: {
      stock: "8 articles disponibles",
      material: "75% Coton, 25% Polyester",
      finish: "Coutures invisibles, Boutons nacrés dissimulés",
      care: "Machine 30°C, séchage naturel"
    }
  },
  { 
    id: 3, 
    name: "Complet Chemise Short", 
    price: 7000, 
    oldPrice: 12000, 
    category: "homme", 
    subcategory: "Ensembles",
    type: "pantalon-courtes-manches",
    images: ["images/ensbordeaux.webp","images/ensbelge.webp","images/ensblanc.webp", "images/ensbleu.webp","images/ensgris.webp", "images/ensnoir.webp","images/ensrose.webp", "images/ensvert.webp"], 
    desc: "Coton haut de gamme. Coupe ajustée. Idéal pour le climat chaud camerounais.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["noir", "blanc", "rouge", "bleu", "gris", "beige", "vert"],
    colorStock: { "noir": 8, "blanc": 2, "rouge": 2, "bleu": 2, "gris": 2, "beige": 2, "vert": 2 },
    specs: {
      stock: "20 articles disponibles",
      material: "100% Coton Haut de Gamme",
      finish: "Couture plate, Elastique de qualité",
      care: "Lavage 30°C, repassage à l'envers"
    }
  },
  { 
    id: 4, 
    name: "RIVIERA : L'ÉLÉGANCE NOMADE", 
    price: 8500, 
    oldPrice: 12500, 
    category: "homme", 
    subcategory: "Ensembles",
    type: "pantalon-courtes-manches",
    images: ["images/ens1bord.webp", "images/ens2vert.webp","images/ens3noir.webp","images/ens4blanc.webp","images/ens5bleu.webp"],
    desc: "L'ensemble Riviera est un coordonné masculin haut de gamme alliant les styles méditerranéen et safari. Conçu en mélange lin-coton pour allier fraîcheur et structure, il se compose d'une chemise architecturale (détails western et poches à rabat) et d'un short habillé à la coupe précise. Disponible en six coloris organiques, c'est une tenue polyvalente qui offre une élégance sans effort, du bord de mer à la soirée.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["bordeaux", "vert", "noir", "blanc", "bleu ciel"],
    colorStock: { "bordeaux": 4, "vert": 2, "noir": 2, "blanc": 2, "bleu ciel": 2 },
    specs: {
      stock: "12 articles disponibles",
      material: "60% Lin, 40% Coton",
      finish: "Poches à rabat, Détails western, Surpiqûres visibles",
      care: "Lavage doux 30°C, légèrement froissé pour l'effet lin"
    }
  },
  { 
    id: 5, 
    name: "NOUVEAU STYLE AFRICAIN", 
    price: 15000, 
    oldPrice: 20000, 
    category: "homme", 
    subcategory: "Ensembles",
    type: "pantalon-courtes-manches",
    images: ["images/ensnoir (2).webp","images/enshautgammegris.webp","images/enshautgammegris1.webp","images/ensvertforet.webp","images/ensbordeaux (2).webp"],
    desc: "C'est un ensemble deux-pièces gris anthracite qui mise tout sur le contraste. Le haut se distingue par ses lignes de coutures blanches apparentes qui soulignent la poitrine et les épaules, donnant une carrure plus affirmée. La coupe est droite, propre, sans col avec des manches courtes pour rester à l'aise. Au bureau : pour avoir un look professionnel sans l'inconfort d'une cravate. Aux cérémonies (mariages, baptêmes) : respectueux de la tradition. Pour une sortie chic au restaurant ou un événement social où l'on veut se démarquer sans en faire trop.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["gris ardoise", "noir", "vert foret", "bordeaux"],
    colorStock: { "gris ardoise": 4, "noir": 2, "vert foret": 2, "bordeaux": 2 },
    specs: {
      stock: "10 articles disponibles",
      material: "100% Polyester Premium",
      finish: "Coutures blanches apparentes, Coupe droite structurée",
      care: "Nettoyage à sec recommandé, repassage facile"
    }
  },
  {
    id: 6, 
    name: "CHEMISE Tropical", 
    price: 5000, 
    oldPrice: 10000,
    category: "homme", 
    subcategory: "Chemises",
    type: "chemise-courtes-manches",
    images: ["images/chemisegrise.webp","images/chemisegrise1.webp"],
    desc: "C'est une chemise gris anthracite qui mise tout sur le contraste. Le haut se distingue par ses lignes de coutures blanches apparentes qui soulignent la poitrine et les épaules, donnant une carrure plus affirmée. La coupe est droite, propre, sans col avec des manches courtes pour rester à l'aise. Au bureau : pour avoir un look professionnel sans l'inconfort d'une cravate. Aux cérémonies (mariages, baptêmes) : respectueux de la tradition. Pour une sortie chic au restaurant ou un événement social où l'on veut se démarquer sans en faire trop.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["gris ardoise"],
    colorStock: { "gris ardoise": 6 },
    specs: {
      stock: "6 articles disponibles",
      material: "100% Coton Léger",
      finish: "Coutures blanches apparentes, Manches courtes, Sans col",
      care: "Lavage 30°C, repassage facile"
    }
  },
  {
    id: 7, 
    name: "Ensemble Denim - chemise col mandarin", 
    price: 15000, 
    oldPrice: 35000, 
    category: "homme", 
    subcategory: "Ensembles",
    type: "culotte-courtes-manches",
    images: ["images/ensemblejeans.webp","images/enscargo.webp","images/enscargo1.webp","images/enscargo2.webp","images/enscargo3.webp","images/enscargo4.webp","images/enscargo5.webp","images/enscargo6.webp"],
    desc: "Pièce signature du style workwear revisité streetwear. Coupe droite confortable mi-cuisse, style cargo authentique avec grandes poches latérales cargo + anneau métal D-ring signature, poches arrière et passepoils renforcés. Matière coton twill robuste, légèrement structurée, parfaite pour un look brut mais stylé. Couleur chaude et lumineuse qui claque super bien avec des Timberland jaunes (comme sur les photos), des boots marron, un t-shirt uni ou une chemise workwear ouverte. Look complet ultra-actuel : vibe chantier chic. Idéal pour l'été, les festivals, les balades urbaines ou juste pour sortir du lot en toute simplicité.",
    sizes: ["S", "M", "L", "XL", "XXL","XXXL","4XL"],
    colors: ["bleu marine", "jaune moutarde", "gris ardoise"],
    colorStock: { "bleu marine": 4, "jaune moutarde": 3, "gris ardoise": 3 },
    specs: {
      stock: "10 articles disponibles",
      material: "100% coton Twill Robuste",
      finish: "Poches cargo latérales, Anneau D-ring, Passepoils renforcés",
      care: "Lavage 40°C, repassage modéré"
    }
  },
  {
    id: 8, 
    name: "Chapeau large bord", 
    price: 3000, 
    oldPrice: 7000, 
    category: "accessoire", 
    subcategory: "chapeaux",
    type: "chapeaux",
    images: ["images/chapeau.webp"],
    desc: "Chapeau de plage.",
    sizes: ["Unique"],
    colors: ["beige", "noir"],
    colorStock: { "beige": 13, "noir": 12 },
    specs: {
      stock: "25 articles disponibles",
      material: "Paille Naturelle",
      finish: "Ruban assorti, Bords larges 7cm",
      care: "Nettoyage doux à l'eau tiède"
    }
  },
  {
    id: 9, 
    name: "Ensemble - chemise sans col", 
    price: 17500, 
    oldPrice: 22000, 
    category: "homme", 
    subcategory: "Ensembles",
    type: "pantalon-longues-manches",
    images: ["images/enschempan1.webp","images/enschempan.webp","images/enschempan2.webp","images/enschempan3.webp","images/enschempan4.webp"],
    desc: "Ensemble élégant et polyvalent combinant une chemise sans col épurée et un pantalon de coupe moderne. Parfait pour le bureau et les événements.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["vert forêt", "noir", "blanc", "bleu nuit", "Bordeaux"],
    colorStock: { "vert forêt": 3, "noir": 5, "blanc": 3, "bleu nuit": 3, "Bordeaux": 3 },
    specs: {
      stock: "14 articles disponibles",
      material: "100% Coton",
      finish: "Fermeture boutons, Coupes ajustées",
      care: "Lavage 30°C, repassage à température moyenne"
    }
  },
  {
    id: 10, 
    name: "Ensemble tunique", 
    price: 25000,
    oldPrice: null, 
    category: "homme", 
    subcategory: "Ensembles",
    type: "tuniques",
    images: ["images/tuniquebleu.webp"],
    desc: "Tunique avec ouverture en avant, pantalon de costume.",
    sizes: ["M", "L", "XL"],
    colors: ["bleu", "blanc", "noir"],
    colorStock: { "bleu": 3, "blanc": 2, "noir": 2 },
    specs: {
      stock: "7 articles disponibles",
      material: "100% Coton Premium",
      finish: "Ouverture frontale boutonnée, Pantalon costume classique",
      care: "Nettoyage à sec ou lavage 30°C"
    }
  },
  { 
    id: 11, 
    name: "Chemise africure, Col Mao", 
    price: 3000, 
    oldPrice: 4500, 
    category: "homme", 
    subcategory: "Chemises",
    type: "chemise-courtes-manches",
    images: ["images/fev2026chem (3).webp", "images/fev2026chem (1).webp", "images/fev2026chem (2).webp", "images/fev2026chem (4).webp", "images/fev2026chem (5).webp", "images/fev2026chem (6).webp", "images/fev2026chem (7).webp", "images/fev2026chem (8).webp", "images/fev2026chem (9).webp", "images/fev2026chem (10).webp", "images/fev2026chem (11).webp", "images/fev2026chem (12).webp","images/fev2026chem (13).webp", "images/fev2026chem (14).webp", "images/fev2026chem (15).webp", "images/fev2026chem (16).webp"], 
    desc: "Caractéristiques de ces chemises en polyester : Design : inspiré des motifs traditionnels africains (géométrie, symboles tribaux) avec des couleurs vives et contrastées. Matière : fibre synthétique offrant une grande résistance et une excellente tenue des couleurs dans le temps. Praticité : vêtements infroissables (pas de repassage nécessaire) qui sèchent très rapidement après lavage. Coupe : chemises à manches courtes, col mao ou classique, offrant un look moderne et décontracté. Usage : idéal pour un style affirmé au quotidien ou lors d'événements, tout en étant facile à entretenir.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["rouge", "bleu", "jaune moutarde", "vert", "noir", "blanc"],
    colorStock: { "rouge": 5, "bleu": 5, "jaune moutarde": 5, "vert": 5, "noir": 5, "blanc": 5 },
    specs: {
      stock: "30 articles disponibles",
      material: "100% Polyester",
      finish: "Motifs africains traditionnels, Col Mao, Manches courtes",
      care: "Infroissable, séchage rapide, pas de repassage"
    }
  },
  {
    id: 12, 
    name: "CHEMISE Albatros satin", 
    price: 2500, 
    oldPrice: 5000, 
    category: "homme", 
    subcategory: "Chemises",
    type: "chemise-courtes-manches",
    images: ["images/chemisevertealbatroce.webp"],
    desc: "Style et Coupe : il s'agit d'une chemise à manches courtes de style saharienne ou abacost, caractérisée par une coupe droite et structurée. Col : elle possède un col officier (ou col mao) boutonné jusqu'en haut, apportant une touche d'élégance formelle. Détails de conception : on remarque un empiècement en forme de V sur la poitrine, souligné par une surpiqûre, ce qui accentue la carrure. Couleur : un vert sapin profond et uniforme, très tendance pour les tenues de cérémonie ou professionnelles.",
    sizes: ["M", "L", "XL"],
    colors: ["vert sapin"],
    colorStock: { "vert sapin": 11 },
    specs: {
      stock: "11 articles disponibles",
      material: "100% Satin de Soie",
      finish: "Empiècement en V, Col officier, Surpiqûres visibles",
      care: "Nettoyage à sec recommandé, repassage doux"
    }
  },
  {
    id: 13, 
    name: "Chemise col américain tricolore", 
    price: 6000, 
    oldPrice: null, 
    category: "homme", 
    subcategory: "Chemises",
    type: "chemise-courtes-manches",
    images: ["images/chemise col américain NGB1.webp", "images/chemise col américain NGB.webp"],
    desc: "Affirmez votre style avec cette chemise à manches courtes au design \"colorblock\" tricolore ultra-tendance, alliant élégamment le noir, le blanc et le gris. Conçue pour une allure urbaine et moderne, elle se distingue par ses finitions pointues, telles qu'un col boutonné rehaussé d'un fin liseré blanc et un jeu audacieux de boutons contrastants. Sa coupe ajustée et son tombé fluide vous assurent une silhouette structurée tout en garantissant un confort optimal tout au long de la journée. Pièce maîtresse de votre garde-robe, elle s'associera aussi bien avec un jean décontracté qu'avec un pantalon chino élégant pour vos sorties.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["noir/blanc/gris"],
    colorStock: { "noir/blanc/gris": 13 },
    specs: {
      stock: "13 articles disponibles",
      material: "100% Coton Stretch",
      finish: "Colorblock tricolore, Col boutonné, Boutons contrastants",
      care: "Lavage 30°C, repassage modéré"
    }
  },
  {
    id: 14, 
    name: "Chemise tricolore", 
    price: 7000, 
    oldPrice: null, 
    category: "homme", 
    subcategory: "Chemises",
    type: "chemise-courtes-manches",
    images: ["images/chem3color.webp","images/chem3color1.webp"],
    desc: "Cette chemise à manches courtes et à la coupe droite confortable est confectionnée dans un tissu gris profond, placés sur le col américain et les deux poches poitrine. Ses finitions soignées, marquées par des surpiqûres blanches apparentes, viennent structurer la carrure et offrir un contraste visuel parfait, faisant de cette pièce un choix idéal aussi bien pour le bureau que pour vos événements du week-end.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["bleu nuit"],
    colorStock: { "bleu nuit": 5 },
    specs: {
      stock: "16 articles disponibles",
      material: "100% Coton",
      finish: "Surpiqûres blanches apparentes, Col américain, Poches poitrine",
      care: "Lavage 30°C, repassage facile"
    }
  },
  {
    id: 15, 
    name: "Ensemble - tunique chemise", 
    price: 15000, 
    oldPrice: 30000, 
    category: "homme", 
    subcategory: "Ensembles",
    type: ["tuniques","pantalon-courtes-manches"],
    images: ["images/image-1.webp","images/image-2.webp","images/image-3.webp","images/image-4.webp","images/image-5.webp","images/image-6.webp","images/image-8.webp"],
    desc: "Découvrez notre chemise utilitaire kaki olive, une pièce iconique au style militaire revisité et ultra-fonctionnel. Dotée d’un col mao droit et montant signature, de manches courtes et d’un devant entièrement boutonné avec des boutons noirs métalliques brillants, elle se distingue par ses quatre poches plaquées (deux poitrine et deux basses) munies de rabats et boutons assortis. Taillée dans un tissu texturé durable et confortable, cette chemise allie une coupe structurée qui affine la silhouette à un esprit workwear chic et contemporain, parfait pour un look safari moderne, casual élégant ou tenue professionnelle décontractée.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["kaki militaire"],
    colorStock: { "kaki militaire": 11 },
    specs: {
      stock: "11 articles disponibles",
      material: "100% Coton",
      finish: "Tunique with chemise assortie, Coupe droite",
      care: "Lavage 30°C, repassage modéré"
    }
  },
  {
    id: 16, 
    name: "Chemise fast-fashion", 
    price: 3000, 
    oldPrice: 3500, 
    category: "homme", 
    subcategory: "Chemises",
    type: "chemise-courtes-manches",
    images: ["images/fast-fashion1.webp","images/fast-fashion2.webp"],
    desc: " Cette chemise courte manche est réalisée en gabardine de coton de haute densité, une matière technique privilégiée pour sa robustesse et son excellente tenue. Grâce à son tissage serré en armure croisée, elle offre une résistance supérieure à l'abrasion tout en conservant une souplesse naturelle pour un confort optimal. Sa structure ferme garantit un tombé impeccable qui ne se froisse que très peu, idéal pour une allure soignée du matin au soir. La coupe, à la fois précise et structurée, met en avant des finitions rigoureuses au niveau du col et des poignets, soulignant le caractère haut de gamme de la pièce. Disponible en vert olive et bleu marine, cette chemise s'impose comme un indispensable durable, capable de résister aux exigences du quotidien tout en affirmant un style masculin affirmé.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["vert olive", "bleu nuit"],
    colorStock: { "vert olive": 9, "bleu nuit": 9 },
    specs: {
      stock: "18 articles disponibles",
      material: "100% Gabardine Coton Haute Densité",
      finish: "Armure croisée, Col structuré, Poignets renforcés",
      care: "Lavage 40°C, repassage modéré"
    }
  },
  {
    id: 17, 
    name: "chemise saharienne à manches courtes", 
    price: 10000, 
    oldPrice: null, 
    category: "homme", 
    subcategory: "Chemises",
    type: "chemise-courtes-manches",
    images: ["images/image-6.webp","images/image-8.webp","images/image-1.webp","images/image-4.webp","images/image-5.webp"],
    desc: " Cette chemise saharienne à manches courtes, confectionnée dans une luxueuse gabardine de soie 100 %, incarne l'alliance parfaite entre élégance utilitaire et raffinement moderne. Sa teinte gris ardoise profonde lui confère une allure sobre et sophistiquée, idéale pour une silhouette masculine à la fois structurée et fluide. Le design se distingue par ses quatre poches à rabat boutonnées, réparties de manière symétrique pour une esthétique équilibrée et fonctionnelle. Les finitions impeccables, le col classique et les boutons contrastés soulignent un travail de haute facture, faisant de cette pièce un choix d'exception qui privilégie la noblesse du textile et une allure intemporelle.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Kaki militaire"],
    colorStock: { "kaki militaire": 5 },
    specs: {
      stock: "5 articles disponibles",
      material: "100% Gabardine de Soie",
      finish: "4 poches à rabat, Boutons contrastés, Manches courtes",
      care: "Nettoyage à sec, repassage à basse température"
    }
  },
  {
    id: 18, 
    name: "chemise col mandarin", 
    price: 7500, 
    oldPrice: 9000, 
    category: "homme", 
    subcategory: "Chemises", 
    type : "chemise-longues-manches",
    images: ["images/image-6_2.webp","images/image-1 (1).webp","images/image-1_1.webp","images/image-3_1.webp","images/image-4_2.webp"],
    desc: " Ces chemises pour hommes présentent un design moderne et élégant, inspiré des styles africains contemporains avec une touche sophistiquée. Elles arborent un col rond (style mandarin ou col mao) sans revers, une fermeture boutonnée sur le devant avec des boutons discrets, et des manches longues ajustées. Leur caractéristique principale réside dans les panneaux contrastants en couleur plus claire (gris sur fond noir, jaune/orange sur vert ou bleu marine), placés sur les épaules et formant une sorte de yoke élégant qui descend légèrement vers l'avant. Les deux grandes poches poitrine rectangulaires, également en tissu contrastant et souvent semi-transparent ou plus clair, ajoutent une dimension fonctionnelle et stylée, avec des boutons décoratifs assortis. Disponibles en versions noir/gris sobre et chic, vert forêt avec accents jaune vif dynamiques, ou bleu marine/orange pour un look plus audacieux, ces chemises combinent coupe droite confortable, tissu fluide et lisse (probablement coton ou mélange synthétique léger), et une esthétique minimaliste mais affirmée. Elles conviennent parfaitement pour un style casual chic, semi-formel ou pour mettre en valeur une allure moderne africaine urbaine. ",
    sizes: ["M", "L", "XL","XXL"],
    colors: ["bleu marine","vert forêt","noir","gris ardoise"],
    colorStock: { "bleu marine": 2, "vert forêt": 1, "noir": 1, "gris ardoise": 1 },
    specs: {
      stock: "5 articles disponibles",
      material: "100% Gabardine de Soie",
      finish: "4 poches à rabat, Boutons contrastés, Manches courtes",
      care: "Nettoyage à 40°C, repassage à basse température"
    }
  }
];



// Tri automatique : les articles les plus récents (id le plus élevé) en premier
products.sort((a, b) => {
  // Si dateAdded est défini, on l'utilise, sinon on trie par id
  if (a.dateAdded && b.dateAdded) {
    return new Date(b.dateAdded) - new Date(a.dateAdded);
  }
  return b.id - a.id;
});
