const translations = {
  navigation: {
    home: "Accueil",
    products: "Produits",
    admin: "Admin",
    supplier: "Fournisseur",
    cart: "Panier",
    login: "Connexion",
    logout: "Déconnexion",
    adminDashboard: "Tableau de Bord Admin",
    supplierDashboard: "Tableau de Bord Fournisseur",
    mobileMenuDescription: "Menu de navigation",
    language: "Langue",
    trackOrder: "Suivi de Commande"
  },
  
  customer: {
    trackOrder: {
      title: "Suivre Votre Commande",
      description: "Entrez votre numéro de commande ou code de suivi pour vérifier l'état de votre commande.",
      byOrderId: "Par Numéro de Commande",
      byTracking: "Par Code de Suivi",
      orderIdPlaceholder: "Entrez votre numéro de commande",
      trackingCodePlaceholder: "Entrez votre code de suivi",
      search: "Rechercher",
      notFound: "Commande Non Trouvée",
      notFoundDesc: "Nous n'avons pas pu trouver de commande correspondant aux informations fournies. Veuillez vérifier et réessayer.",
      yourOrders: "Vos Commandes",
      noOrders: "Aucune Commande Trouvée",
      noOrdersDesc: "Vous n'avez pas encore passé de commande.",
      shopNow: "Acheter Maintenant"
    },
    order: {
      details: "Détails de la Commande",
      orderDate: "Commandé le {date}",
      timeline: "Chronologie de la Commande",
      cancelled: "Commande Annulée",
      cancelledDesc: "Cette commande a été annulée. Veuillez contacter le service client si vous avez des questions.",
      shippingInfo: "Informations d'Expédition",
      paymentInfo: "Informations de Paiement",
      items: "Articles Commandés",
      size: "Taille",
      color: "Couleur",
      quantity: "Qté",
      total: "Total",
      trackingCode: "Code de Suivi",
      estimatedDelivery: "Livraison Estimée",
      statuses: {
        pending: "En Attente",
        processing: "En Traitement",
        shipped: "Expédiée",
        delivered: "Livrée",
        cancelled: "Annulée"
      },
      paymentStatus: {
        paid: "Payée",
        pending: "Paiement en Attente"
      }
    }
  },
  
  hero: {
    title: "Abonnez-vous au Contenu Exclusif",
    subtitle: "Rejoignez notre programme d'adhésion pour des designs uniques, un accès anticipé et des remises spéciales.",
    browseButton: "Parcourir les Produits",
    registerButton: "S'inscrire"
  },
  
  featuredProducts: {
    title: "Produits en Vedette",
    subtitle: "Découvrez nos designs tendance et collections exclusives",
    viewAllButton: "Voir Tous les Produits"
  },
  
  subscriptions: {
    title: "Plans d'Abonnement",
    subtitle: "Choisissez un plan qui vous convient",
    subscribeButton: "S'abonner",
    
    basic: {
      title: "Basique",
      description: "Parfait pour les fans occasionnels",
      benefits: {
        discount: "10% de réduction sur tous les produits",
        earlyAccess: "Accès anticipé aux nouveautés",
        newsletter: "Newsletter mensuelle"
      },
      nonBenefits: {
        collections: "Collections réservées aux membres",
        shipping: "Livraison gratuite"
      }
    },
    
    premium: {
      popular: "Plus Populaire",
      title: "Premium",
      description: "Meilleur rapport qualité-prix pour les passionnés",
      benefits: {
        discount: "20% de réduction sur tous les produits",
        earlyAccess: "Accès anticipé aux nouveautés",
        newsletter: "Newsletter exclusive mensuelle",
        collections: "Collections réservées aux membres",
        shipping: "Livraison gratuite pour les commandes de plus de 50€"
      }
    },
    
    vip: {
      title: "VIP",
      description: "Pour les vrais collectionneurs",
      benefits: {
        discount: "30% de réduction sur tous les produits",
        earlyAccess: "Accès anticipé aux nouveautés",
        newsletter: "Newsletter premium avec aperçus de l'industrie",
        collections: "Collections réservées aux membres et éditions limitées",
        shipping: "Livraison gratuite sur toutes les commandes",
        support: "Support client VIP"
      }
    }
  },
  
  payment: {
    title: "Options de Paiement Flexibles",
    subtitle: "Choisissez la méthode de paiement qui vous convient le mieux",
    
    creditCard: {
      title: "Carte de Crédit",
      description: "Paiement sécurisé avec les principales cartes de crédit",
      badge: "Paiement Sécurisé"
    },
    
    mobileMoney: {
      title: "MTN Mobile Money",
      description: "Payez directement avec MTN Mobile Money"
    },
    
    telecel: {
      title: "Telecel",
      description: "Payez avec Telecel mobile"
    },
    
    bankTransfer: {
      title: "Virement Bancaire",
      description: "Virement bancaire direct vers notre compte",
      badge: "Transfert Sécurisé"
    }
  },
  
  comingSoon: {
    title: "Bientôt Disponible",
    subtitle: "Designs exclusifs à venir. Soyez le premier à savoir quand ils arrivent.",
    badge: "Bientôt Disponible",
    notifyButton: "Me Notifier",
    availableOn: "Disponible le",
    noProducts: "Aucun produit à venir pour le moment. Revenez plus tard !",
    notificationSaved: "Demande de notification enregistrée",
    notificationDescription: "Nous vous informerons dès que ce produit sera disponible"
  },
  
  cta: {
    title: "Prêt à Rejoindre Notre Communauté Exclusive?",
    description: "Accédez à du contenu premium, des remises spéciales et des lancements anticipés. Rejoignez des milliers de membres satisfaits dès aujourd'hui.",
    signupButton: "Choisir un Plan",
    exploreButton: "En Savoir Plus"
  },
  
  footer: {
    description: "Contenu premium et designs exclusifs pour notre communauté mondiale d'amateurs de mode.",
    quickLinks: "Liens Rapides",
    support: "Support",
    contact: "Contactez-Nous",
    rights: "Tous droits réservés.",
    
    links: {
      home: "Accueil",
      products: "Produits",
      about: "À Propos",
      contact: "Contact"
    },
    
    supportLinks: {
      faq: "FAQ",
      shipping: "Expédition & Retours",
      returns: "Guide des Tailles",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation"
    }
  },
  
  auth: {
    login: {
      tabTitle: "Connexion",
      title: "Bienvenue",
      description: "Entrez vos identifiants pour accéder à votre compte",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      submit: "Se Connecter",
      loggingIn: "Connexion en cours...",
      registerLink: "Pas de compte? S'inscrire"
    },
    
    register: {
      tabTitle: "Inscription",
      title: "Créer un Compte",
      description: "Inscrivez-vous pour obtenir un accès exclusif et des avantages",
      fullName: "Nom Complet",
      email: "Email",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      role: "Je suis un:",
      customerRole: "Client",
      supplierRole: "Fournisseur",
      submit: "Créer un Compte",
      creatingAccount: "Création du compte...",
      loginLink: "Déjà un compte? Connectez-vous"
    },
    
    hero: {
      title: "Bienvenue chez Cloud9wear",
      subtitle: "Votre destination premium pour des vêtements de créateurs uniques",
      benefit1: "Accès à des designs exclusifs non disponibles ailleurs",
      benefit2: "Accès anticipé aux nouveautés avant le grand public",
      benefit3: "Remises spéciales et promotions réservées aux membres",
      benefit4: "Options de livraison gratuite et livraison mondiale"
    }
  },
  
  products: {
    title: "Tous les Produits",
    searchPlaceholder: "Rechercher des produits...",
    categoryFilter: "Filtrer par catégorie",
    allCategories: "Toutes les Catégories",
    sortBy: "Trier par",
    sortOptions: {
      latest: "Plus récents",
      priceLow: "Prix: Croissant",
      priceHigh: "Prix: Décroissant",
      popular: "Populaires"
    },
    outOfStock: "Rupture de Stock",
    quickAdd: "Ajouter",
    quickAddTitle: "Ajouter au Panier",
    size: "Taille",
    color: "Couleur",
    selectSize: "Sélectionner la taille",
    selectColor: "Sélectionner la couleur",
    selectOptions: "Veuillez sélectionner la taille et la couleur",
    addToCart: "Ajouter au Panier",
    cancel: "Annuler",
    addedToCart: "Produit ajouté au panier",
    noResults: {
      title: "Aucun produit trouvé",
      message: "Essayez de modifier votre recherche ou vos critères de filtrage"
    }
  },
  
  productDetail: {
    size: "Taille",
    color: "Couleur",
    quantity: "Quantité",
    inStock: "en stock",
    selectSize: "Sélectionner la taille",
    selectColor: "Sélectionner la couleur",
    addToCart: "Ajouter au Panier",
    outOfStock: "Rupture de Stock",
    shipping: "Livraison gratuite pour les commandes de plus de 50€",
    category: "Catégorie",
    
    validation: {
      sizeRequired: "Veuillez sélectionner une taille",
      colorRequired: "Veuillez sélectionner une couleur"
    },
    
    addedToCart: "Ajouté au panier avec succès",
    
    tabs: {
      details: "Détails du Produit",
      sizing: "Guide des Tailles",
      shipping: "Informations d'Expédition",
      detailsTitle: "Détails du Produit",
      sizingTitle: "Tableau des Tailles",
      shippingTitle: "Informations d'Expédition",
      shippingInfo: "Nous expédions dans le monde entier avec suivi disponible pour toutes les commandes. La livraison standard prend 5 à 7 jours ouvrables, tandis que la livraison express est de 2 à 3 jours ouvrables.",
      shippingNote: "En raison du COVID-19, certaines livraisons peuvent connaître de légers retards. Nous apprécions votre patience."
    },
    
    notFound: {
      title: "Produit Non Trouvé",
      message: "Le produit que vous recherchez n'existe pas ou a été supprimé.",
      backButton: "Retour aux Produits"
    }
  },
  
  cart: {
    title: "Votre Panier",
    empty: {
      title: "Votre panier est vide",
      message: "Il semble que vous n'ayez pas encore ajouté de produits à votre panier.",
      browseButton: "Parcourir les Produits"
    },
    items: "Articles du Panier",
    clearButton: "Vider le Panier",
    orderSummary: "Résumé de la Commande",
    subtotal: "Sous-total",
    shipping: "Livraison",
    tax: "TVA (10%)",
    total: "Total",
    checkoutButton: "Passer à la Caisse",
    size: "Taille",
    remove: "Supprimer",
    
    promoAlert: {
      title: "Livraison Gratuite",
      description: "Profitez de la livraison gratuite pour les commandes de plus de 50€ !"
    },
    
    notifications: {
      added: "Article ajouté au panier",
      removed: "Article supprimé du panier",
      cleared: "Le panier a été vidé"
    }
  },
  
  checkout: {
    title: "Paiement",
    shippingDetails: "Détails de Livraison",
    paymentMethod: "Méthode de Paiement",
    backToCart: "Retour au Panier",
    placeOrder: "Passer la Commande",
    processing: "Traitement en cours...",
    orderSummary: "Résumé de la Commande",
    subtotal: "Sous-total",
    shipping: "Livraison",
    tax: "TVA (10%)",
    total: "Total",
    
    form: {
      address: "Adresse de Livraison",
      addressPlaceholder: "Entrez votre adresse complète de livraison",
      phone: "Téléphone de Contact",
      phonePlaceholder: "Entrez votre numéro de téléphone"
    },
    
    payment: {
      creditCard: {
        title: "Carte de Crédit",
        description: "Payez en toute sécurité avec votre carte de crédit"
      },
      mtnMobile: {
        title: "MTN Mobile Money",
        description: "Payez avec votre compte MTN Mobile Money"
      },
      telecel: {
        title: "Telecel",
        description: "Payez avec votre compte Telecel"
      },
      bankTransfer: {
        title: "Virement Bancaire",
        description: "Payez par virement bancaire (le traitement prend 1 à 2 jours ouvrables)"
      }
    },
    
    orderSuccess: {
      title: "Commande Passée avec Succès!",
      description: "Merci pour votre achat",
      orderNumber: "Numéro de Commande",
      confirmationEmail: "Nous avons envoyé un email de confirmation avec les détails de votre commande.",
      continueShopping: "Continuer les Achats"
    },
    
    orderError: {
      title: "Erreur lors de la commande",
      tryAgain: "Veuillez réessayer plus tard"
    }
  },
  
  admin: {
    refresh: "Actualiser",
    
    sidebar: {
      adminPanel: "Admin",
      dashboard: "Tableau de Bord",
      orders: "Commandes",
      products: "Produits",
      customers: "Clients",
      suppliers: "Fournisseurs",
      reviews: "Avis",
      comingSoon: "Bientôt Disponible",
      settings: "Paramètres",
      storefront: "Visiter la Boutique",
      logout: "Déconnexion"
    },
    
    dashboard: {
      title: "Tableau de Bord Admin",
      salesAnalytics: "Analyse des Ventes",
      salesDescription: "Suivez vos performances de vente au fil du temps",
      recentOrders: "Commandes Récentes",
      recentOrdersDescription: "Dernières commandes des clients",
      
      stats: {
        sales: "Ventes Totales",
        orders: "Commandes Totales",
        customers: "Clients",
        products: "Produits"
      },
      
      orders: {
        id: "ID",
        customer: "Client",
        amount: "Montant",
        status: "Statut",
        date: "Date"
      }
    },
    
    chart: {
      sales: "Ventes",
      orders: "Commandes"
    },
    
    orders: {
      title: "Gestion des Commandes",
      description: "Gérez et suivez les commandes des clients",
      filterByStatus: "Filtrer par statut",
      allOrders: "Toutes les Commandes",
      view: "Voir",
      orderDetails: "Détails de la Commande #{id}",
      customerInfo: "Informations Client",
      orderInfo: "Informations de Commande",
      items: "Articles",
      total: "Total",
      address: "Adresse de Livraison",
      phone: "Téléphone de Contact",
      status: "Statut",
      payment: "Méthode de Paiement",
      paymentStatus: "Statut du Paiement",
      updateStatus: "Mettre à Jour le Statut",
      selectStatus: "Sélectionner un statut",
      update: "Mettre à jour",
      addTracking: "Ajouter Informations de Suivi",
      trackingPlaceholder: "Entrer le code de suivi",
      markShipped: "Marquer comme Expédié",
      trackingInfo: "Informations de Suivi",
      trackingCode: "Code de Suivi",
      estimatedDelivery: "Livraison Estimée",
      noOrders: "Aucune commande trouvée",
      noOrdersDesc: "Il n'y a pas de commandes correspondant aux filtres actuels.",
      updateSuccess: "Commande mise à jour avec succès",
      updateError: "Échec de la mise à jour de la commande",
      fetchError: "Échec de la récupération des détails de la commande",
      trackingRequired: "Le code de suivi est requis pour marquer comme expédié",
      
      statuses: {
        pending: "En Attente",
        processing: "En Traitement",
        shipped: "Expédiée",
        delivered: "Livrée",
        cancelled: "Annulée"
      },
      
      table: {
        id: "ID Commande",
        customer: "Client",
        amount: "Montant",
        status: "Statut",
        date: "Date",
        actions: "Actions"
      }
    },
    
    products: {
      title: "Gestion des Produits",
      description: "Gérez votre catalogue de produits",
      filterByCategory: "Filtrer par catégorie",
      allCategories: "Toutes les Catégories",
      add: "Ajouter un Produit",
      addFirst: "Ajouter Premier Produit",
      edit: "Modifier",
      delete: "Supprimer",
      active: "Actif",
      inactive: "Inactif",
      actions: "Actions",
      noProducts: "Aucun produit trouvé",
      noProductsDesc: "Il n'y a pas encore de produits dans votre catalogue.",
      
      addProduct: "Ajouter Nouveau Produit",
      editProduct: "Modifier le Produit",
      addDescription: "Créer un nouveau produit dans votre catalogue",
      editDescription: "Modifier les détails du produit existant",
      saving: "Enregistrement...",
      saveButton: "Enregistrer le Produit",
      updateButton: "Mettre à Jour le Produit",
      cancel: "Annuler",
      deleteConfirmTitle: "Supprimer le Produit?",
      deleteConfirmDesc: "Cette action ne peut pas être annulée. Le produit sera définitivement supprimé de votre catalogue.",
      confirmDelete: "Oui, Supprimer",
      
      addSuccess: "Produit ajouté avec succès",
      addSuccessDesc: "Votre nouveau produit a été ajouté au catalogue",
      updateSuccess: "Produit mis à jour avec succès",
      updateSuccessDesc: "Votre produit a été mis à jour",
      deleteSuccess: "Produit supprimé avec succès",
      deleteSuccessDesc: "Le produit a été supprimé de votre catalogue",
      addError: "Échec de l'ajout du produit",
      updateError: "Échec de la mise à jour du produit",
      deleteError: "Échec de la suppression du produit",
      
      form: {
        name: "Nom du Produit",
        price: "Prix",
        discount: "Remise (%)",
        discountDescription: "Entrez le pourcentage de remise (0-100)",
        category: "Catégorie",
        selectCategory: "Sélectionner une catégorie",
        stock: "Stock",
        supplier: "ID Fournisseur",
        active: "Actif",
        activeDescription: "Ce produit sera visible dans la boutique",
        description: "Description",
        images: "Images du Produit",
        imageUrl: "URL de l'Image",
        uploadImage: "Télécharger Image",
        addImage: "Ajouter Image",
        orEnterUrl: "Ou entrer URL",
        selectImage: "Sélectionner Image",
        urlTab: "URL",
        uploadTab: "Télécharger",
        uploading: "Chargement...",
        sizes: "Tailles Disponibles",
        sizePlaceholder: "Taille (ex. S, M, L, XL)",
        addSize: "Ajouter Taille",
        colors: "Couleurs Disponibles",
        colorPlaceholder: "Couleur (ex. Rouge, Bleu, Noir)",
        addColor: "Ajouter Couleur",
        chooseColor: "Choisir Couleur",
        selectAColor: "Sélectionner une Couleur"
      },
      
      table: {
        id: "ID",
        name: "Nom du Produit",
        price: "Prix",
        category: "Catégorie",
        stock: "Stock",
        status: "Statut",
        actions: "Actions"
      }
    },
    
    reviews: {
      title: "Gestion des Avis",
      description: "Gérer les avis des produits sur votre boutique",
      allReviews: "Tous les Avis",
      addReview: "Ajouter un Avis",
      addReviewDesc: "Créer un nouvel avis de produit",
      viewProduct: "Voir le Produit",
      deleteReview: "Supprimer l'Avis",
      search: "Rechercher des avis...",
      sortBy: "Trier par",
      sortField: "Champ de tri",
      date: "Date",
      rating: "Évaluation",
      product: "Produit",
      customer: "Client", 
      comment: "Commentaire",
      actions: "Actions",
      id: "ID",
      
      selectProduct: "Sélectionner un produit",
      selectCustomer: "Sélectionner un client",
      selectRating: "Évaluation",
      commentPlaceholder: "Entrez le commentaire...",
      commentDesc: "Ceci sera affiché publiquement sur la page du produit",
      commentMinLength: "Le commentaire doit comporter au moins 5 caractères",
      productRequired: "Le produit est requis",
      customerRequired: "Le client est requis",
      
      noReviews: "Aucun avis trouvé",
      noSearchResults: "Aucun avis correspondant à votre recherche",
      
      createSuccess: "Avis créé avec succès",
      createSuccessDesc: "L'avis a été ajouté au produit",
      createError: "Échec de la création de l'avis",
      
      deleteConfirmTitle: "Supprimer l'Avis?",
      deleteConfirmDesc: "Cette action ne peut pas être annulée. L'avis sera définitivement supprimé.",
      deleteSuccess: "Avis supprimé avec succès",
      deleteSuccessDesc: "L'avis a été supprimé",
      deleteError: "Échec de la suppression de l'avis"
    }
  },
  
  supplier: {
    sidebar: {
      supplierPanel: "Fournisseur",
      dashboard: "Tableau de Bord",
      inventory: "Inventaire",
      orders: "Commandes",
      storefront: "Visiter la Boutique",
      logout: "Déconnexion"
    },
    
    dashboard: {
      title: "Tableau de Bord Fournisseur",
      welcome: "Bienvenue, {name}",
      welcomeMessage: "Gérez votre inventaire et suivez les performances de vos produits",
      lowStockTitle: "Produits en Stock Faible",
      lowStockDesc: "Produits nécessitant une attention",
      allStocked: "Tous les produits bien approvisionnés",
      allStockedDesc: "Vous n'avez aucun produit avec un niveau d'inventaire bas",
      quickActions: "Actions Rapides",
      manageInventory: "Gérer l'Inventaire",
      tips: "Conseils aux Fournisseurs",
      tip1: "Maintenez votre inventaire à jour pour éviter les ruptures de stock",
      tip2: "Ajoutez des images de haute qualité pour augmenter l'attrait des produits",
      tip3: "Répondez rapidement aux notifications de stock faible",
      
      stats: {
        totalProducts: "Total Produits",
        lowStock: "Stock Faible",
        needsAttention: "Besoin d'attention",
        totalStock: "Stock Total"
      },
      
      products: {
        id: "ID Produit",
        stock: "Stock",
        lastUpdated: "Dernière Mise à Jour"
      }
    },
    
    inventory: {
      title: "Gestion de l'Inventaire",
      description: "Gérez les niveaux d'inventaire de vos produits",
      search: "Rechercher dans l'inventaire...",
      refresh: "Actualiser",
      update: "Mettre à Jour",
      updateSuccess: "Inventaire mis à jour avec succès",
      updateError: "Échec de la mise à jour de l'inventaire",
      noProducts: "Aucun produit trouvé",
      noProductsDesc: "Vous n'avez pas encore de produits dans votre inventaire.",
      lowStock: "Stock Faible",
      id: "ID",
      availableSizes: "Tailles",
      availableColors: "Couleurs",
      stock: "Stock"
    },
    
    orders: {
      title: "Gestion des Commandes",
      description: "Consultez et gérez les commandes clients",
      allOrders: "Toutes les Commandes",
      fetchError: "Erreur lors de la récupération de la commande",
      fetchErrorDesc: "Impossible de charger les détails de la commande",
      statusUpdateSuccess: "Statut de la commande mis à jour",
      statusUpdateSuccessDesc: "Le statut de la commande a été mis à jour avec succès",
      statusUpdateError: "Erreur de mise à jour du statut",
      statusUpdateErrorDesc: "Échec de la mise à jour du statut de la commande",
      selectStatus: "Sélectionner un statut",
      filterByStatus: "Filtrer par statut",
      noOrders: "Aucune commande trouvée",
      noOrdersDesc: "Il n'y a aucune commande à afficher.",
      waitingForPayment: "En attente de paiement",
      noActionsAvailable: "Aucune action disponible",
      viewAllOrders: "Affichage de toutes les commandes",
      
      status: {
        pendingOrders: "Commandes en Attente",
        processingOrders: "Commandes en Traitement",
        shippedOrders: "Commandes Expédiées",
        deliveredOrders: "Commandes Livrées",
        cancelledOrders: "Commandes Annulées",
        pending: "En Attente",
        processing: "En Traitement",
        shipped: "Expédiée",
        delivered: "Livrée",
        cancelled: "Annulée"
      },
      
      payment: {
        paid: "Payée",
        pending: "En Attente",
        failed: "Échouée",
        refunded: "Remboursée"
      },
      
      table: {
        id: "ID Commande",
        customer: "Client",
        date: "Date de Commande",
        amount: "Montant",
        status: "Statut",
        payment: "Paiement",
        actions: "Actions"
      },
      
      actions: {
        startProcessing: "Traiter",
        markShipped: "Expédier",
        markDelivered: "Livrée"
      }
    }
  },
  
  dataTable: {
    search: "Rechercher...",
    noResults: "Aucun résultat trouvé",
    showing: "Affichage",
    of: "sur",
    previous: "Précédent",
    next: "Suivant"
  }
};

export default translations;
