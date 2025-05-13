const translations = {
  navigation: {
    home: "Startseite",
    products: "Produkte",
    admin: "Admin",
    supplier: "Lieferant",
    cart: "Warenkorb",
    login: "Anmelden",
    logout: "Abmelden",
    adminDashboard: "Admin-Dashboard",
    supplierDashboard: "Lieferanten-Dashboard",
    mobileMenuDescription: "Navigationsmenü",
    language: "Sprache",
    trackOrder: "Bestellung verfolgen"
  },
  
  customer: {
    trackOrder: {
      title: "Ihre Bestellung verfolgen",
      description: "Geben Sie Ihre Bestellnummer oder Ihren Tracking-Code ein, um den Status Ihrer Bestellung zu überprüfen.",
      byOrderId: "Nach Bestellnummer",
      byTracking: "Nach Tracking-Code",
      orderIdPlaceholder: "Geben Sie Ihre Bestellnummer ein",
      trackingCodePlaceholder: "Geben Sie Ihren Tracking-Code ein",
      search: "Suchen",
      notFound: "Bestellung nicht gefunden",
      notFoundDesc: "Wir konnten keine Bestellung finden, die den angegebenen Informationen entspricht. Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
      yourOrders: "Ihre Bestellungen",
      noOrders: "Keine Bestellungen gefunden",
      noOrdersDesc: "Sie haben noch keine Bestellungen aufgegeben.",
      shopNow: "Jetzt einkaufen"
    },
    order: {
      details: "Bestelldetails",
      orderDate: "Bestellt am {date}",
      timeline: "Bestellverlauf",
      cancelled: "Bestellung storniert",
      cancelledDesc: "Diese Bestellung wurde storniert. Bitte kontaktieren Sie den Kundenservice, wenn Sie Fragen haben.",
      shippingInfo: "Versandinformationen",
      paymentInfo: "Zahlungsinformationen",
      items: "Bestellte Artikel",
      size: "Größe",
      color: "Farbe",
      quantity: "Menge",
      total: "Gesamt",
      amountPaid: "Bezahlter Betrag",
      trackingCode: "Tracking-Code",
      estimatedDelivery: "Geschätzte Lieferung",
      noItems: "Keine Artikel in dieser Bestellung",
      viewDetails: "Details anzeigen",
      statuses: {
        pending: "Ausstehend",
        processing: "In Bearbeitung",
        shipped: "Versendet",
        delivered: "Zugestellt",
        cancelled: "Storniert"
      },
      paymentStatus: {
        paid: "Bezahlt",
        pending: "Zahlung ausstehend"
      }
    }
  },
  
  hero: {
    title: "Abonniere Exklusive Inhalte",
    subtitle: "Tritt unserem Mitgliedschaftsprogramm für einzigartige Designs, frühzeitigen Zugang und Sonderrabatte bei.",
    browseButton: "Produkte Durchsuchen",
    registerButton: "Registrieren"
  },
  
  featuredProducts: {
    title: "Ausgewählte Produkte",
    subtitle: "Entdecke unsere trendigen Designs und exklusiven Kollektionen",
    viewAllButton: "Alle Produkte Anzeigen"
  },
  
  subscriptions: {
    title: "Abonnementpläne",
    subtitle: "Wähle einen Mitgliedschaftsplan, der für dich funktioniert",
    subscribeButton: "Jetzt Abonnieren",
    
    basic: {
      title: "Basic",
      description: "Perfekt für Gelegenheitsnutzer",
      benefits: {
        discount: "10% Rabatt auf alle Produkte",
        earlyAccess: "Frühzeitiger Zugang zu neuen Veröffentlichungen",
        newsletter: "Monatlicher Newsletter"
      },
      nonBenefits: {
        collections: "Exklusive Kollektionen für Mitglieder",
        shipping: "Kostenloser Versand"
      }
    },
    
    premium: {
      popular: "Am Beliebtesten",
      title: "Premium",
      description: "Bestes Preis-Leistungs-Verhältnis für Enthusiasten",
      benefits: {
        discount: "20% Rabatt auf alle Produkte",
        earlyAccess: "Frühzeitiger Zugang zu neuen Veröffentlichungen",
        newsletter: "Exklusiver monatlicher Newsletter",
        collections: "Exklusive Kollektionen für Mitglieder",
        shipping: "Kostenloser Versand bei Bestellungen über 50€"
      }
    },
    
    vip: {
      title: "VIP",
      description: "Für echte Sammler",
      benefits: {
        discount: "30% Rabatt auf alle Produkte",
        earlyAccess: "Frühzeitiger Zugang zu neuen Veröffentlichungen",
        newsletter: "Premium-Newsletter mit Brancheneinblicken",
        collections: "Exklusive Kollektionen für Mitglieder und limitierte Editionen",
        shipping: "Kostenloser Versand für alle Bestellungen",
        support: "VIP-Kundensupport"
      }
    }
  },
  
  payment: {
    title: "Flexible Zahlungsoptionen",
    subtitle: "Wähle die Zahlungsmethode, die am besten für dich funktioniert",
    
    creditCard: {
      title: "Kreditkarte",
      description: "Sichere Zahlung mit gängigen Kreditkarten",
      badge: "Sichere Zahlung"
    },
    
    mobileMoney: {
      title: "MTN Mobile Money",
      description: "Zahle direkt mit MTN Mobile Money"
    },
    
    telecel: {
      title: "Telecel",
      description: "Zahle mit Telecel mobile payment"
    },
    
    bankTransfer: {
      title: "Banküberweisung",
      description: "Direkte Banküberweisung auf unser Konto",
      badge: "Sichere Überweisung"
    }
  },
  
  comingSoon: {
    title: "Demnächst Verfügbar",
    subtitle: "Exklusive Designs erscheinen bald. Sei der Erste, der erfährt, wann sie ankommen.",
    badge: "Demnächst Verfügbar",
    notifyButton: "Benachrichtige Mich",
    availableOn: "Verfügbar am",
    noProducts: "Derzeit keine kommenden Produkte. Schau später wieder vorbei!",
    notificationSaved: "Benachrichtigungsanfrage gespeichert",
    notificationDescription: "Wir informieren dich, sobald dieses Produkt verfügbar ist"
  },
  
  cta: {
    title: "Bereit, unserer exklusiven Gemeinschaft beizutreten?",
    description: "Erhalte Zugang zu Premium-Inhalten, Sonderrabatten und frühzeitigen Produktveröffentlichungen. Tritt heute Tausenden zufriedener Mitglieder bei.",
    signupButton: "Plan Wählen",
    exploreButton: "Mehr Erfahren"
  },
  
  footer: {
    description: "Premium-Inhalte und exklusive Designs für unsere globale Gemeinschaft von Modebegeisterten.",
    quickLinks: "Schnelllinks",
    support: "Support",
    contact: "Kontakt",
    rights: "Alle Rechte vorbehalten.",
    
    links: {
      home: "Startseite",
      products: "Produkte",
      about: "Über Uns",
      contact: "Kontakt"
    },
    
    supportLinks: {
      faq: "FAQ",
      shipping: "Versand & Rückgabe",
      returns: "Größenführer",
      privacy: "Datenschutzrichtlinie",
      terms: "Nutzungsbedingungen"
    }
  },
  
  auth: {
    login: {
      tabTitle: "Anmelden",
      title: "Willkommen Zurück",
      description: "Gib deine Anmeldedaten ein, um auf dein Konto zuzugreifen",
      username: "Benutzername",
      password: "Passwort",
      submit: "Anmelden",
      loggingIn: "Anmelden...",
      registerLink: "Kein Konto? Registrieren"
    },
    
    register: {
      tabTitle: "Registrieren",
      title: "Konto Erstellen",
      description: "Registriere dich für exklusiven Zugang und Vorteile",
      fullName: "Vollständiger Name",
      email: "E-Mail",
      username: "Benutzername",
      password: "Passwort",
      role: "Ich bin ein:",
      customerRole: "Kunde",
      supplierRole: "Lieferant",
      submit: "Konto Erstellen",
      creatingAccount: "Konto erstellen...",
      loginLink: "Bereits ein Konto? Anmelden"
    },
    
    hero: {
      title: "Willkommen bei Cloud9wear",
      subtitle: "Dein Premium-Ziel für einzigartige Designerkleidung",
      benefit1: "Zugang zu exklusiven Designs, die anderswo nicht erhältlich sind",
      benefit2: "Frühzeitiger Zugang zu neuen Veröffentlichungen vor der Allgemeinheit",
      benefit3: "Sonderrabatte und exklusive Aktionen für Mitglieder",
      benefit4: "Kostenlose Versandoptionen und weltweite Lieferung"
    }
  },
  
  products: {
    title: "Alle Produkte",
    searchPlaceholder: "Produkte suchen...",
    categoryFilter: "Nach Kategorie filtern",
    allCategories: "Alle Kategorien",
    sortBy: "Sortieren nach",
    sortOptions: {
      latest: "Neueste",
      priceLow: "Preis: Niedrig bis Hoch",
      priceHigh: "Preis: Hoch bis Niedrig",
      popular: "Beliebt"
    },
    outOfStock: "Ausverkauft",
    quickAdd: "Schnell Hinzufügen",
    quickAddTitle: "Zum Warenkorb Hinzufügen",
    size: "Größe",
    color: "Farbe",
    selectSize: "Größe wählen",
    selectColor: "Farbe wählen",
    selectOptions: "Bitte Größe und Farbe auswählen",
    addToCart: "In den Warenkorb",
    cancel: "Abbrechen",
    addedToCart: "Produkt zum Warenkorb hinzugefügt",
    noResults: {
      title: "Keine Produkte gefunden",
      message: "Versuche, deine Such- oder Filterkriterien zu ändern"
    }
  },
  
  productDetail: {
    size: "Größe",
    color: "Farbe",
    quantity: "Menge",
    inStock: "auf Lager",
    selectSize: "Größe wählen",
    selectColor: "Farbe wählen",
    addToCart: "In den Warenkorb",
    outOfStock: "Ausverkauft",
    shipping: "Kostenloser Versand bei Bestellungen über 50€",
    category: "Kategorie",
    
    validation: {
      sizeRequired: "Bitte wähle eine Größe",
      colorRequired: "Bitte wähle eine Farbe"
    },
    
    addedToCart: "Erfolgreich zum Warenkorb hinzugefügt",
    
    tabs: {
      details: "Produktdetails",
      sizing: "Größenführer",
      shipping: "Versandinformationen",
      detailsTitle: "Produktdetails",
      sizingTitle: "Größentabelle",
      shippingTitle: "Versandinformationen",
      shippingInfo: "Wir versenden weltweit mit Sendungsverfolgung für alle Bestellungen. Die Standardlieferung dauert 5-7 Werktage, während die Expresslieferung 2-3 Werktage beträgt.",
      shippingNote: "Aufgrund von COVID-19 können einige Lieferungen leichte Verzögerungen erfahren. Wir danken für Ihr Verständnis."
    },
    
    notFound: {
      title: "Produkt Nicht Gefunden",
      message: "Das gesuchte Produkt existiert nicht oder wurde entfernt.",
      backButton: "Zurück zu Produkten"
    }
  },
  
  cart: {
    title: "Dein Warenkorb",
    empty: {
      title: "Dein Warenkorb ist leer",
      message: "Es sieht so aus, als hättest du noch keine Produkte zu deinem Warenkorb hinzugefügt.",
      browseButton: "Produkte Durchsuchen"
    },
    items: "Warenkorb Artikel",
    clearButton: "Warenkorb Leeren",
    orderSummary: "Bestellübersicht",
    subtotal: "Zwischensumme",
    shipping: "Versand",
    tax: "Steuern (10%)",
    total: "Gesamtsumme",
    checkoutButton: "Zur Kasse",
    size: "Größe",
    remove: "Entfernen",
    
    promoAlert: {
      title: "Kostenloser Versand",
      description: "Genieße kostenlosen Versand bei Bestellungen über 50€!"
    },
    
    notifications: {
      added: "Artikel zum Warenkorb hinzugefügt",
      removed: "Artikel aus dem Warenkorb entfernt",
      cleared: "Warenkorb wurde geleert"
    }
  },
  
  checkout: {
    title: "Kasse",
    shippingDetails: "Versanddetails",
    paymentMethod: "Zahlungsmethode",
    backToCart: "Zurück zum Warenkorb",
    placeOrder: "Bestellung Aufgeben",
    processing: "Verarbeitung...",
    orderSummary: "Bestellübersicht",
    subtotal: "Zwischensumme",
    shipping: "Versand",
    tax: "Steuern (10%)",
    total: "Gesamtsumme",
    
    form: {
      address: "Lieferadresse",
      addressPlaceholder: "Gib deine vollständige Lieferadresse ein",
      phone: "Kontakttelefon",
      phonePlaceholder: "Gib deine Telefonnummer ein"
    },
    
    payment: {
      creditCard: {
        title: "Kreditkarte",
        description: "Sicher mit deiner Kreditkarte bezahlen"
      },
      mtnMobile: {
        title: "MTN Mobile Money",
        description: "Bezahle mit deinem MTN Mobile Money Konto"
      },
      telecel: {
        title: "Telecel",
        description: "Bezahle mit deinem Telecel Konto"
      },
      bankTransfer: {
        title: "Banküberweisung",
        description: "Bezahle per Banküberweisung (Bearbeitung dauert 1-2 Werktage)"
      }
    },
    
    orderSuccess: {
      title: "Bestellung Erfolgreich Aufgegeben!",
      description: "Vielen Dank für deinen Einkauf",
      orderNumber: "Bestellnummer",
      confirmationEmail: "Wir haben eine Bestätigungs-E-Mail mit deinen Bestelldaten gesendet.",
      continueShopping: "Weiter Einkaufen"
    },
    
    orderError: {
      title: "Fehler bei der Bestellung",
      tryAgain: "Bitte versuche es später erneut"
    }
  },
  
  admin: {
    refresh: "Aktualisieren",
    
    sidebar: {
      adminPanel: "Admin",
      dashboard: "Dashboard",
      orders: "Bestellungen",
      products: "Produkte",
      customers: "Kunden",
      suppliers: "Lieferanten",
      reviews: "Bewertungen",
      comingSoon: "Demnächst",
      settings: "Einstellungen",
      storefront: "Shop Besuchen",
      logout: "Abmelden"
    },
    
    dashboard: {
      title: "Admin-Dashboard",
      salesAnalytics: "Verkaufsanalyse",
      salesDescription: "Verfolge deine Verkaufsleistung im Zeitverlauf",
      recentOrders: "Aktuelle Bestellungen",
      recentOrdersDescription: "Neueste Kundenbestellungen",
      
      stats: {
        sales: "Gesamtumsatz",
        orders: "Bestellungen Gesamt",
        customers: "Kunden",
        products: "Produkte"
      },
      
      orders: {
        id: "ID",
        customer: "Kunde",
        amount: "Betrag",
        status: "Status",
        date: "Datum"
      }
    },
    
    chart: {
      sales: "Umsatz",
      orders: "Bestellungen"
    },
    
    orders: {
      title: "Bestellungsverwaltung",
      description: "Verwalte und verfolge Kundenbestellungen",
      filterByStatus: "Nach Status filtern",
      allOrders: "Alle Bestellungen",
      view: "Ansehen",
      orderDetails: "Bestelldetails #{id}",
      customerInfo: "Kundeninformationen",
      orderInfo: "Bestellinformationen",
      items: "Artikel",
      total: "Gesamt",
      address: "Lieferadresse",
      phone: "Kontakttelefon",
      status: "Status",
      payment: "Zahlungsmethode",
      paymentStatus: "Zahlungsstatus",
      updateStatus: "Status Aktualisieren",
      selectStatus: "Status auswählen",
      update: "Aktualisieren",
      addTracking: "Tracking-Informationen Hinzufügen",
      trackingPlaceholder: "Tracking-Code eingeben",
      markShipped: "Als Versendet Markieren",
      trackingInfo: "Tracking-Informationen",
      trackingCode: "Tracking-Code",
      estimatedDelivery: "Voraussichtliche Lieferung",
      noOrders: "Keine Bestellungen gefunden",
      noOrdersDesc: "Es gibt keine Bestellungen, die den aktuellen Filtern entsprechen.",
      updateSuccess: "Bestellung erfolgreich aktualisiert",
      updateError: "Fehler beim Aktualisieren der Bestellung",
      fetchError: "Fehler beim Abrufen der Bestelldetails",
      trackingRequired: "Tracking-Code ist erforderlich, um als versendet zu markieren",
      
      statuses: {
        pending: "Ausstehend",
        processing: "In Bearbeitung",
        shipped: "Versendet",
        delivered: "Geliefert",
        cancelled: "Storniert"
      },
      
      table: {
        id: "Bestell-ID",
        customer: "Kunde",
        amount: "Betrag",
        status: "Status",
        date: "Datum",
        actions: "Aktionen"
      }
    },
    
    products: {
      title: "Produktverwaltung",
      description: "Verwalte deinen Produktkatalog",
      filterByCategory: "Nach Kategorie filtern",
      allCategories: "Alle Kategorien",
      add: "Produkt Hinzufügen",
      addFirst: "Erstes Produkt Hinzufügen",
      edit: "Bearbeiten",
      delete: "Löschen",
      active: "Aktiv",
      inactive: "Inaktiv",
      actions: "Aktionen",
      noProducts: "Keine Produkte gefunden",
      noProductsDesc: "Es gibt noch keine Produkte in deinem Katalog.",
      
      addProduct: "Neues Produkt Hinzufügen",
      editProduct: "Produkt Bearbeiten",
      addDescription: "Erstelle ein neues Produkt in deinem Katalog",
      editDescription: "Bearbeite bestehende Produktdetails",
      saving: "Speichern...",
      saveButton: "Produkt Speichern",
      updateButton: "Produkt Aktualisieren",
      cancel: "Abbrechen",
      deleteConfirmTitle: "Produkt Löschen?",
      deleteConfirmDesc: "Diese Aktion kann nicht rückgängig gemacht werden. Das Produkt wird dauerhaft aus deinem Katalog entfernt.",
      confirmDelete: "Ja, Löschen",
      
      addSuccess: "Produkt erfolgreich hinzugefügt",
      addSuccessDesc: "Dein neues Produkt wurde zum Katalog hinzugefügt",
      updateSuccess: "Produkt erfolgreich aktualisiert",
      updateSuccessDesc: "Dein Produkt wurde aktualisiert",
      deleteSuccess: "Produkt erfolgreich gelöscht",
      deleteSuccessDesc: "Das Produkt wurde aus deinem Katalog entfernt",
      addError: "Fehler beim Hinzufügen des Produkts",
      updateError: "Fehler beim Aktualisieren des Produkts",
      deleteError: "Fehler beim Löschen des Produkts",
      
      form: {
        name: "Produktname",
        price: "Preis",
        discount: "Rabatt (%)",
        discountDescription: "Rabatt in Prozent eingeben (0-100)",
        category: "Kategorie",
        selectCategory: "Kategorie auswählen",
        stock: "Bestand",
        supplier: "Lieferanten-ID",
        active: "Aktiv",
        activeDescription: "Dieses Produkt wird im Shop sichtbar sein",
        description: "Beschreibung",
        images: "Produktbilder",
        imageUrl: "Bild-URL",
        uploadImage: "Bild Hochladen",
        addImage: "Bild Hinzufügen",
        orEnterUrl: "Oder URL eingeben",
        selectImage: "Bild Auswählen",
        urlTab: "URL",
        uploadTab: "Hochladen",
        uploading: "Lade hoch...",
        sizes: "Verfügbare Größen",
        sizePlaceholder: "Größe (z.B. S, M, L, XL)",
        addSize: "Größe Hinzufügen",
        colors: "Verfügbare Farben",
        colorPlaceholder: "Farbe (z.B. Rot, Blau, Schwarz)",
        addColor: "Farbe Hinzufügen",
        chooseColor: "Farbe Auswählen",
        selectAColor: "Wähle eine Farbe"
      },
      
      table: {
        id: "ID",
        name: "Produktname",
        price: "Preis",
        category: "Kategorie",
        stock: "Bestand",
        status: "Status",
        actions: "Aktionen"
      }
    },
    
    reviews: {
      title: "Bewertungsverwaltung",
      description: "Verwalten Sie Produktbewertungen in Ihrem Shop",
      allReviews: "Alle Bewertungen",
      addReview: "Bewertung hinzufügen",
      addReviewDesc: "Erstellen Sie eine neue Produktbewertung",
      viewProduct: "Produkt anzeigen",
      deleteReview: "Bewertung löschen",
      search: "Bewertungen durchsuchen...",
      sortBy: "Sortieren nach",
      sortField: "Sortierfeld",
      date: "Datum",
      rating: "Bewertung",
      product: "Produkt",
      customer: "Kunde", 
      comment: "Kommentar",
      actions: "Aktionen",
      id: "ID",
      
      selectProduct: "Produkt auswählen",
      selectCustomer: "Kunde auswählen",
      selectRating: "Bewertung",
      commentPlaceholder: "Kommentar eingeben...",
      commentDesc: "Wird öffentlich auf der Produktseite angezeigt",
      commentMinLength: "Kommentar muss mindestens 5 Zeichen haben",
      productRequired: "Produkt ist erforderlich",
      customerRequired: "Kunde ist erforderlich",
      
      noReviews: "Keine Bewertungen gefunden",
      noSearchResults: "Keine Bewertungen zu Ihrer Suche gefunden",
      
      createSuccess: "Bewertung erfolgreich erstellt",
      createSuccessDesc: "Die Bewertung wurde zum Produkt hinzugefügt",
      createError: "Fehler beim Erstellen der Bewertung",
      
      deleteConfirmTitle: "Bewertung löschen?",
      deleteConfirmDesc: "Diese Aktion kann nicht rückgängig gemacht werden. Die Bewertung wird dauerhaft gelöscht.",
      deleteSuccess: "Bewertung erfolgreich gelöscht",
      deleteSuccessDesc: "Die Bewertung wurde entfernt",
      deleteError: "Fehler beim Löschen der Bewertung"
    }
  },
  
  supplier: {
    sidebar: {
      supplierPanel: "Lieferant",
      dashboard: "Dashboard",
      inventory: "Inventar",
      orders: "Bestellungen",
      storefront: "Shop Besuchen",
      logout: "Abmelden"
    },
    
    dashboard: {
      title: "Lieferanten-Dashboard",
      welcome: "Willkommen, {name}",
      welcomeMessage: "Verwalte dein Inventar und verfolge die Leistung deiner Produkte",
      lowStockTitle: "Produkte mit Niedrigem Bestand",
      lowStockDesc: "Produkte, die Aufmerksamkeit benötigen",
      allStocked: "Alle Produkte gut bevorratet",
      allStockedDesc: "Du hast keine Produkte mit niedrigem Bestand",
      quickActions: "Schnellaktionen",
      manageInventory: "Inventar Verwalten",
      tips: "Lieferantentipps",
      tip1: "Halte dein Inventar aktuell, um Bestandsausfälle zu vermeiden",
      tip2: "Füge hochwertige Bilder hinzu, um die Produktattraktivität zu steigern",
      tip3: "Reagiere schnell auf Benachrichtigungen über niedrigen Bestand",
      
      stats: {
        totalProducts: "Produkte Gesamt",
        lowStock: "Niedriger Bestand",
        needsAttention: "Benötigt Aufmerksamkeit",
        totalStock: "Gesamtbestand"
      },
      
      products: {
        id: "Produkt-ID",
        stock: "Bestand",
        lastUpdated: "Zuletzt Aktualisiert"
      }
    },
    
    inventory: {
      title: "Inventarverwaltung",
      description: "Verwalte deine Produktbestandsebenen",
      search: "Inventar durchsuchen...",
      refresh: "Aktualisieren",
      update: "Aktualisieren",
      remove: "Entfernen",
      updateSuccess: "Inventar erfolgreich aktualisiert",
      updateError: "Fehler beim Aktualisieren des Inventars",
      removeSuccess: "Produkt aus dem Inventar entfernt",
      removeError: "Fehler beim Entfernen des Produkts aus dem Inventar",
      noProducts: "Keine Produkte gefunden",
      noProductsDesc: "Du hast noch keine Produkte in deinem Inventar.",
      lowStock: "Niedriger Bestand",
      id: "ID",
      availableSizes: "Größen",
      availableColors: "Farben",
      stock: "Bestand"
    },
    
    orders: {
      title: "Bestellungsverwaltung",
      description: "Sieh dir Kundenbestellungen an und verwalte sie",
      allOrders: "Alle Bestellungen",
      fetchError: "Fehler beim Abrufen der Bestellung",
      fetchErrorDesc: "Bestellungsdetails konnten nicht geladen werden",
      statusUpdateSuccess: "Bestellungsstatus aktualisiert",
      statusUpdateSuccessDesc: "Der Bestellungsstatus wurde erfolgreich aktualisiert",
      statusUpdateError: "Fehler beim Aktualisieren des Status",
      statusUpdateErrorDesc: "Bestellungsstatus konnte nicht aktualisiert werden",
      selectStatus: "Status auswählen",
      filterByStatus: "Nach Status filtern",
      noOrders: "Keine Bestellungen gefunden",
      noOrdersDesc: "Es gibt keine Bestellungen zum Anzeigen.",
      waitingForPayment: "Warten auf Zahlung",
      noActionsAvailable: "Keine Aktionen verfügbar",
      viewAllOrders: "Alle Bestellungen anzeigen",
      
      status: {
        pendingOrders: "Ausstehende Bestellungen",
        processingOrders: "Bestellungen in Bearbeitung",
        shippedOrders: "Versendete Bestellungen",
        deliveredOrders: "Zugestellte Bestellungen",
        cancelledOrders: "Stornierte Bestellungen",
        pending: "Ausstehend",
        processing: "In Bearbeitung",
        shipped: "Versendet",
        delivered: "Zugestellt",
        cancelled: "Storniert"
      },
      
      payment: {
        paid: "Bezahlt",
        pending: "Ausstehend",
        failed: "Fehlgeschlagen",
        refunded: "Erstattet"
      },
      
      table: {
        id: "Bestellungs-ID",
        customer: "Kunde",
        date: "Bestelldatum",
        amount: "Betrag",
        status: "Status",
        payment: "Zahlung",
        actions: "Aktionen"
      },
      
      actions: {
        startProcessing: "Bearbeiten",
        markShipped: "Versenden",
        markDelivered: "Zustellen"
      }
    }
  },
  
  dataTable: {
    search: "Suchen...",
    noResults: "Keine Ergebnisse gefunden",
    showing: "Zeige",
    of: "von",
    previous: "Zurück",
    next: "Weiter"
  }
};

export default translations;
