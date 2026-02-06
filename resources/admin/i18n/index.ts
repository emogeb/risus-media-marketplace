import { createI18n } from 'vue-i18n'

const messages = {
  tr: {
    common: {
      reset: 'Sıfırla',
    },
    layout: {
      userMenu: {
        profile: 'Profil',
        settings: 'Ayarlar',
        logout: 'Çıkış',
      },
    },
    dashboard: {
      title: 'Yönetim Merkezi',
      description: 'Genel bakış ve istatistikler',
      sections: {
        sales: {
          title: 'Satış Özeti',
          description: 'Gelir, siparişler ve satış performansı',
        },
        operations: {
          title: 'Operasyon',
          description: 'Günlük operasyonlar, uyarılar ve yapılacaklar',
        },
      },
      header: {
        title: 'Atelier Overview',
        subtitle: 'Luxury bridal operations & sales',
        dateRange: {
          today: 'Bugün',
          last7Days: 'Son 7 gün',
          last30Days: 'Son 30 gün',
          custom: 'Özel',
        },
        quickActions: {
          viewOrders: 'Siparişleri Görüntüle',
          newProduct: 'Yeni Ürün',
          fulfillmentQueue: 'Sevkiyat Kuyruğu',
        },
      },
      toolbar: {
        title: 'Genel Bakış',
        subtitle: 'Bugünkü durum ve özetler',
        quickActions: {
          orders: 'Siparişler',
          products: 'Ürünler',
          sellers: 'Satıcılar',
        },
        customize: 'Özelleştir',
      },
      customize: {
        title: 'Dashboard Özelleştir',
        resetDefaults: 'Varsayılana Dön',
        close: 'Kapat',
        moveUp: 'Yukarı',
        moveDown: 'Aşağı',
      },
      views: {
        title: 'Görünümler',
        presets: 'Hazır Görünümler',
        custom: 'Özel Görünümler',
        saveCurrent: 'Bu görünümü kaydet',
        manage: 'Yönet',
        manageTitle: 'Görünümleri Yönet',
        close: 'Kapat',
        noCustomViews: 'Henüz özel görünüm yok',
        saveModal: {
          title: 'Görünümü Kaydet',
          nameLabel: 'Görünüm Adı',
          namePlaceholder: 'Örn: Haftalık Rapor',
          save: 'Kaydet',
          cancel: 'İptal',
        },
        renameModal: {
          title: 'Görünümü Yeniden Adlandır',
          nameLabel: 'Yeni Ad',
          save: 'Kaydet',
          cancel: 'İptal',
        },
        deleteModal: {
          title: 'Görünümü Sil',
          message: '"{name}" görünümünü silmek istediğinizden emin misiniz?',
          delete: 'Sil',
          cancel: 'İptal',
        },
      },
      widgets: {
        kpis: {
          title: 'KPI Kartları',
          description: 'Toplam gelir, siparişler ve önemli metrikler',
        },
        production: {
          title: 'Üretim Durumu',
          description: 'Bugünkü atölye durumu ve üretim bilgileri',
        },
        alerts: {
          title: 'Aksiyon Gerektirenler',
          description: 'Operasyonel uyarılar ve yapılması gerekenler',
        },
        revenue: {
          title: 'Gelir Trendi',
          description: 'Gelir grafiği ve trend analizi',
        },
        operations: {
          title: 'Operasyon Kuyruğu',
          description: 'Aktif iş akışları ve operasyon durumu',
        },
        recentOrders: {
          title: 'Son Siparişler',
          description: 'En son gelen siparişler ve aktiviteler',
        },
        lowStock: {
          title: 'Düşük Stok',
          description: 'Düşük stok uyarıları ve stok durumu',
        },
        activityLog: {
          title: 'Son Aktivite',
          subtitle: 'Sistem aktivite kayıtları',
          description: 'Son sistem aktiviteleri ve değişiklikler',
          empty: {
            title: 'Henüz aktivite yok',
            description: 'Sipariş, stok ve satıcı olayları burada görünecek.',
          },
          error: {
            title: 'API entegrasyonu bekleniyor',
            description: 'Aktiviteler API\'den yüklenecek',
          },
        },
        todaySnapshot: {
          title: 'Hızlı Özet',
          description: 'Bugünkü özet bilgiler',
          columns: {
            today: {
              title: 'Bugün',
              orders: 'Sipariş sayısı',
              revenue: 'Ciro',
              returns: 'İade',
            },
            operations: {
              title: 'Operasyon',
              toPack: 'Paketlenecek',
              inTransit: 'Kargoda',
              delivered: 'Teslim edildi',
            },
            customer: {
              title: 'Müşteri',
              newRegistration: 'Yeni kayıt',
              newCompany: 'Yeni şirket',
              newSeller: 'Yeni satıcı',
            },
          },
        },
        alerts: {
          title: 'Aksiyon Gerektirenler',
          description: 'Operasyonel uyarılar ve yapılması gerekenler',
          empty: {
            title: 'Şu anda aksiyon gerektiren bir durum yok',
            description: 'Siparişler, stoklar ve satıcı işlemleri burada görünecek.',
          },
          error: {
            title: 'API entegrasyonu bekleniyor',
            description: 'Uyarılar API\'den yüklenecek',
          },
        },
        setup: {
          title: 'Kurulum Kontrol Listesi',
          subtitle: 'Sistemi hızlıca başlatın',
          description: 'İlk kurulum adımlarını tamamlayın',
          progress: 'İlerleme',
          go: 'Git',
          customize: 'Özelleştir',
          allCompleted: 'Tüm adımlar tamamlandı! 🎉',
          resetAll: 'Hepsini Sıfırla',
          steps: {
            'company-info': {
              title: 'Şirket bilgilerini tamamla',
              description: 'Şirket adı, iletişim ve adres bilgileri',
            },
            'first-product': {
              title: 'İlk ürününü ekle',
              description: 'Katalogunuza ilk ürünü ekleyin',
            },
            'first-seller': {
              title: 'İlk satıcıyı ekle',
              description: 'Satıcı hesabı oluşturun ve entegre edin',
            },
            'fulfillment-settings': {
              title: 'Kargo/teslimat ayarlarını kontrol et',
              description: 'Sevkiyat ve teslimat yöntemlerini yapılandırın',
            },
            'payment-settings': {
              title: 'Ödeme yöntemlerini kontrol et',
              description: 'Ödeme gateway\'lerini ve ayarlarını kontrol edin',
            },
            'customize-dashboard': {
              title: 'Dashboard görünümünü özelleştir',
              description: 'Widget\'ları düzenleyin ve görünüm kaydedin',
            },
          },
        },
      },
      kpi: {
        totalRevenue: 'Toplam Gelir',
        totalOrders: 'Toplam Sipariş',
        pendingOrders: 'Bekleyen Siparişler',
        lowStock: 'Düşük Stok',
        growthLabel: 'önceki aya göre',
        noData: 'Henüz veri yok',
      },
      cards: {
        revenueTrend: {
          title: 'Gelir Trendi',
          subtitle: 'Son 7 gün',
          empty: {
            title: 'Henüz gelir verisi bulunmuyor',
            description: 'Siparişler geldikçe gelir trendi burada görünecek. İlk siparişinizi bekliyoruz.',
            actions: {
              orders: 'Siparişlere Git',
              products: 'Ürün Ekle',
            },
          },
        },
        recentOrders: {
          title: 'Son Siparişler',
          subtitle: 'Son aktiviteler',
          empty: {
            title: 'Henüz sipariş bulunmuyor',
            description: 'Gösterilecek son sipariş yok. İlk siparişinizi bekliyoruz.',
            action: 'Siparişlere Git',
          },
        },
        operationsQueue: {
          title: 'Operasyon Kuyruğu',
          subtitle: 'Aktif iş akışları',
          measurements: 'Ölçü Alınacak',
          measurementsDesc: 'Müşteri ölçü randevusu bekliyor',
          alterations: 'Düzenleme Yapılıyor',
          alterationsDesc: 'Gelinlik düzenleme aşamasında',
          ready: 'Teslim İçin Hazır',
          readyDesc: 'Müşteri teslim için bekliyor',
          empty: {
            title: 'Henüz aktif operasyon bulunmuyor',
            description: 'Siparişler geldikçe ölçü, düzenleme ve teslim durumları burada görünecek. İlk siparişinizi bekliyoruz.',
            action: 'İş Akışını Yapılandır',
          },
        },
        lowStock: {
          title: 'Düşük Stok Uyarıları',
          subtitle: 'Dikkat gerektirenler',
          empty: {
            title: 'Tüm stoklar yeterli',
            description: 'Şu anda düşük stok uyarısı bulunmuyor. Stok seviyeleri normal.',
          },
          viewAll: 'Tümünü Görüntüle',
          noSku: 'SKU yok',
          unit: 'adet',
          badge: 'Düşük Stok',
        },
        fulfillmentSplit: {
          title: 'Sevkiyat Dağılımı',
          subtitle: 'Sevkiyat detayları',
          shipping: 'Kargo',
          pickup: 'Mağazadan Al',
          empty: {
            title: 'Henüz analitik verisi yok',
            description: 'Siparişler işlendikçe sevkiyat analitiği burada görünecek. İlk siparişinizi bekliyoruz.',
          },
        },
        topProducts: {
          title: 'En Çok Satan Ürünler',
          salesUnit: 'satış',
          empty: {
            title: 'Henüz analitik verisi yok',
            description: 'Satışlar başladıkça en çok satan ürünler burada görünecek. İlk siparişinizi bekliyoruz.',
          },
        },
        productionSnapshot: {
          title: 'Bugün Atölyede',
          subtitle: 'Aktif üretim ve hazırlık durumu',
          sewing: 'Dikimde',
          fittingPending: 'Prova Bekleyen',
          readyForDelivery: 'Teslime Hazır',
          delayed: 'Geciken İşler',
          footerNote: 'Günlük atölye durumu burada görünecek',
        },
      },
      alerts: {
        lowStock: {
          message: 'Düşük stoklu ürünler var',
        },
        pendingPack: {
          message: 'Paketlenmeyi bekleyen siparişler',
        },
        pendingPayment: {
          message: 'Ödeme bekleyen siparişler',
        },
        sellerApproval: {
          message: 'Satıcı onayı bekleyen ürünler',
        },
        actionButton: 'Git',
      },
      snapshot: {
        title: 'Hızlı Özet',
        description: 'Bugünkü özet bilgiler',
        columns: {
          today: {
            title: 'Bugün',
            orders: 'Sipariş sayısı',
            revenue: 'Ciro',
            returns: 'İade',
          },
          operations: {
            title: 'Operasyon',
            toPack: 'Paketlenecek',
            inTransit: 'Kargoda',
            delivered: 'Teslim edildi',
          },
          customer: {
            title: 'Müşteri',
            newRegistration: 'Yeni kayıt',
            newCompany: 'Yeni şirket',
            newSeller: 'Yeni satıcı',
          },
        },
      },
      activity: {
        title: 'Son Hareketler',
        subtitle: 'Son sistem aktiviteleri',
        empty: {
          title: 'Henüz aktivite yok',
          description: 'Sipariş, ürün, satıcı ve müşteri olayları burada görünecek. Başlamak için ilgili sayfalara gidin.',
          actions: {
            orders: 'Siparişler',
            products: 'Ürünler',
            sellers: 'Satıcılar',
            customers: 'Müşteriler',
          },
        },
      },
      shortcuts: {
        title: 'Hızlı Erişim',
        description: 'Sık kullanılan sayfalara hızlı erişim',
        noPermission: 'Bu sayfaya erişim yetkiniz bulunmuyor',
        items: {
          orders: {
            title: 'Siparişler',
            description: 'Tüm siparişleri görüntüle ve yönet',
          },
          products: {
            title: 'Ürünler',
            description: 'Ürün kataloğunu görüntüle ve düzenle',
          },
          sellers: {
            title: 'Satıcılar',
            description: 'Satıcı hesaplarını yönet',
          },
          customersIndividual: {
            title: 'Bireysel Müşteriler',
            description: 'Bireysel müşteri kayıtlarını görüntüle',
          },
          customersCompany: {
            title: 'Şirket Müşterileri',
            description: 'Şirket müşteri kayıtlarını görüntüle',
          },
        },
      },
      glance: {
        title: 'Durum Özeti',
        description: 'Bugünkü önemli metrikler',
        items: {
          revenueToday: {
            label: 'Bugünkü Ciro',
          },
          newOrders: {
            label: 'Yeni Siparişler',
          },
          pendingPayments: {
            label: 'Bekleyen Ödemeler',
          },
          lowStock: {
            label: 'Düşük Stok',
          },
        },
      },
      operational: {
        recentOrders: {
          title: 'Son Siparişler',
          description: 'Son hareketler (API bağlanınca)',
          empty: {
            title: 'Henüz sipariş yok',
            description: 'Siparişler burada görünecek',
          },
          error: {
            title: 'Yükleme hatası',
            description: 'Siparişler yüklenirken bir hata oluştu',
            retry: 'Tekrar dene',
          },
        },
        todo: {
          title: 'Bugün Yapılacaklar',
          description: 'Aksiyon gerektiren görevler',
          empty: {
            title: 'Bugün yapılacak bir şey yok',
            description: 'Tüm görevler tamamlandı',
          },
        },
      },
      checklist: {
        title: 'Operasyon Checklist',
        subtitle: 'Günlük operasyon görevleri',
        progressLabel: 'Bugün tamamlanan: {completed} / {total}',
        items: {
          morningReview: 'Sabah durum değerlendirmesi',
          orderProcessing: 'Sipariş işleme kontrolü',
          inventoryCheck: 'Stok kontrolü ve güncelleme',
          customerFollowup: 'Müşteri takibi',
          sellerCoordination: 'Satıcı koordinasyonu',
          endOfDayReport: 'Gün sonu raporu',
        },
      },
      quickActions: {
        title: 'Hızlı İşlemler',
        description: 'Sık kullanılan işlemlere hızlı erişim',
        actions: {
          newProduct: {
            label: 'Yeni Ürün',
            description: 'Kataloğa ürün ekle',
          },
          newOrder: {
            label: 'Yeni Sipariş',
            description: 'Manuel sipariş oluştur',
          },
          newSeller: {
            label: 'Yeni Satıcı',
            description: 'Satıcı hesabı ekle',
          },
          fulfillmentQueue: {
            label: 'Sevkiyat Kuyruğu',
            description: 'Paketleme ve gönderim',
          },
        },
      },
      empty: {
        kpi: {
          title: 'Veri yok',
          description: 'KPI verileri henüz yüklenmedi',
          cta: 'Yenile',
        },
        activity: {
          title: 'Henüz hareket yok',
          description: 'Son aktiviteler burada görünecek',
          cta: 'Siparişlere Git',
        },
        orders: {
          title: 'Henüz sipariş yok',
          description: 'Siparişler burada görünecek',
          cta: 'Siparişlere Git',
        },
        revenue: {
          title: 'Gelir verisi yok',
          description: 'Gelir trendi verileri henüz yüklenmedi',
          cta: 'Siparişlere Git',
        },
        alerts: {
          title: 'Aksiyon gerektiren durum yok',
          description: 'Tüm sistemler normal çalışıyor',
          cta: 'Detayları Gör',
        },
        glance: {
          title: 'Özet verisi yok',
          description: 'Durum özeti verileri henüz yüklenmedi',
          cta: 'Yenile',
        },
      },
      error: {
        title: 'Yükleme hatası',
        description: 'Veriler yüklenirken bir hata oluştu',
        retry: 'Tekrar Dene',
      },
      cta: {
        viewOrders: 'Siparişlere Git',
        viewProducts: 'Ürünlere Git',
        viewSellers: 'Satıcılara Git',
        viewCustomers: 'Müşterilere Git',
        refresh: 'Yenile',
        retry: 'Tekrar Dene',
      },
    },
    orders: {
      savedViews: {
        label: 'Görünümler',
        default: 'Tüm Siparişler',
        presetsLabel: 'Hazır Görünümler',
        custom: 'Özel Görünümler',
        presets: {
          todayFittings: 'Bugün Provalar',
          due7Days: 'Teslime 7 Gün Kalan',
          overdue: 'Geciken İşler',
          measurementPending: 'Ölçü Bekleyen',
        },
        saveCurrent: 'Mevcut filtreleri kaydet',
      },
      deliveryInfo: {
        title: 'Teslim Bilgisi',
        dueDate: 'Teslim Hedef Tarihi',
        deliveryMethod: 'Teslimat Yöntemi',
        shipping: 'Kargo',
        storePickup: 'Mağazadan Teslim',
        overdueWarning: 'Bu sipariş teslim tarihini geçti',
        dueSoonWarning: 'Teslim tarihi yaklaşıyor',
        empty: 'Henüz teslim bilgisi yok',
      },
    },
    commandPalette: {
      placeholder: 'Komut ara veya sayfa aç...',
      empty: 'Sonuç bulunamadı',
      navigate: 'Gezin',
      select: 'Seç',
      close: 'Kapat',
      groups: {
        navigation: 'Gezinme',
        quickFilters: 'Hızlı Filtreler',
      },
      commands: {
        dashboard: {
          title: 'Dashboard',
        },
        orders: {
          title: 'Siparişler',
        },
        products: {
          title: 'Ürünler',
        },
        customersIndividual: {
          title: 'Müşteriler (Bireysel)',
        },
        customersCompany: {
          title: 'Müşteriler (Şirket)',
        },
        sellers: {
          title: 'Satıcılar',
        },
        lowStock: {
          title: 'Düşük Stok',
          description: 'Düşük stoklu ürünleri göster',
        },
        pendingPayment: {
          title: 'Ödeme Bekleyen',
          description: 'Ödeme bekleyen siparişleri göster',
        },
        toPack: {
          title: 'Paketlenecek',
          description: 'Paketlenmeyi bekleyen siparişler',
        },
      },
    },
    activity: {
      actions: {
        'order.update': 'Sipariş durumu güncellendi',
        'order.create': 'Yeni sipariş oluşturuldu',
        'order.delete': 'Sipariş silindi',
        'product.update': 'Ürün bilgileri güncellendi',
        'product.create': 'Yeni ürün eklendi',
        'product.delete': 'Ürün silindi',
        'seller.create': 'Yeni satıcı eklendi',
        'seller.update': 'Satıcı bilgileri güncellendi',
        'seller.delete': 'Satıcı silindi',
        'settings.update': 'Ayarlar güncellendi',
        'view.save': 'Dashboard görünümü kaydedildi',
        'view.delete': 'Dashboard görünümü silindi',
        'customer.create': 'Yeni müşteri eklendi',
        'customer.update': 'Müşteri bilgileri güncellendi',
      },
    },
    sellers: {
      create: {
        button: 'Yeni Satıcı',
        title: 'Yeni Satıcı Ekle',
        description: 'Yeni bir satıcı hesabı oluşturun',
        submit: 'Kaydet',
        cancel: 'İptal',
        fields: {
          name: {
            label: 'Satıcı Adı',
            placeholder: 'Örn: ABC Mağazası',
          },
          contactName: {
            label: 'İletişim Adı',
            placeholder: 'Örn: Ahmet Yılmaz',
          },
          phone: {
            label: 'Telefon',
            placeholder: 'Örn: +90 555 123 4567',
          },
          email: {
            label: 'E-posta',
            placeholder: 'ornek@email.com',
          },
          city: {
            label: 'Şehir',
            placeholder: 'Örn: İstanbul',
          },
          status: {
            label: 'Durum',
            options: {
              active: 'Aktif',
              inactive: 'Pasif',
            },
          },
        },
        messages: {
          pending: 'Kaydedilecek',
          pendingDescription: 'API entegrasyonu bekleniyor',
        },
      },
    },
    products: {
      create: {
        button: 'Yeni Ürün',
      },
    },
    customers: {
      create: {
        button: 'Yeni Müşteri',
      },
    },
    forms: {
      submitting: 'Kaydediliyor...',
      validation: {
        required: 'Bu alan zorunludur',
        minLength: 'En az {min} karakter olmalıdır',
        email: 'Geçerli bir e-posta adresi giriniz',
        numberMin: 'Değer en az {min} olmalıdır',
      },
      unsavedChanges: {
        title: 'Kaydedilmemiş Değişiklikler',
        description: 'Kaydetmeden çıkarsanız bilgileriniz kaybolacak.',
        continue: 'Devam Et',
        stay: 'Kal',
      },
    },
    bulkActions: {
      selectedCount: '{count} öğe seçildi',
      clear: 'Temizle',
      orders: {
        updateStatus: 'Durumu Güncelle',
      },
      products: {
        updateStock: 'Stok Güncelle',
      },
      sellers: {
        changeStatus: 'Durumu Değiştir',
      },
    },
  },
  en: {
    common: {
      reset: 'Reset',
    },
    layout: {
      userMenu: {
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
      },
    },
    dashboard: {
      title: 'Management Center',
      description: 'Overview and statistics',
      sections: {
        sales: {
          title: 'Sales Summary',
          description: 'Revenue, orders and sales performance',
        },
        operations: {
          title: 'Operations',
          description: 'Daily operations, alerts and tasks',
        },
      },
      header: {
        title: 'Atelier Overview',
        subtitle: 'Luxury bridal operations & sales management',
        dateRange: {
          today: 'Today',
          last7Days: 'Last 7 days',
          last30Days: 'Last 30 days',
          custom: 'Custom',
        },
        quickActions: {
          viewOrders: 'View Orders',
          newProduct: 'New Product',
          fulfillmentQueue: 'Fulfillment Queue',
        },
      },
      toolbar: {
        title: 'Overview',
        subtitle: 'Today\'s status and summaries',
        quickActions: {
          orders: 'Orders',
          products: 'Products',
          sellers: 'Sellers',
        },
        customize: 'Customize',
      },
      customize: {
        title: 'Customize Dashboard',
        resetDefaults: 'Reset to Defaults',
        close: 'Close',
        moveUp: 'Move Up',
        moveDown: 'Move Down',
      },
      views: {
        title: 'Views',
        presets: 'Preset Views',
        custom: 'Custom Views',
        saveCurrent: 'Save current view',
        manage: 'Manage',
        manageTitle: 'Manage Views',
        close: 'Close',
        noCustomViews: 'No custom views yet',
        saveModal: {
          title: 'Save View',
          nameLabel: 'View Name',
          namePlaceholder: 'e.g., Weekly Report',
          save: 'Save',
          cancel: 'Cancel',
        },
        renameModal: {
          title: 'Rename View',
          nameLabel: 'New Name',
          save: 'Save',
          cancel: 'Cancel',
        },
        deleteModal: {
          title: 'Delete View',
          message: 'Are you sure you want to delete "{name}" view?',
          delete: 'Delete',
          cancel: 'Cancel',
        },
      },
      widgets: {
        kpis: {
          title: 'KPI Cards',
          description: 'Total revenue, orders and key metrics',
        },
        production: {
          title: 'Production Status',
          description: 'Today\'s atelier status and production info',
        },
        alerts: {
          title: 'Action Required',
          description: 'Operational alerts and pending actions',
        },
        revenue: {
          title: 'Revenue Trend',
          description: 'Revenue chart and trend analysis',
        },
        operations: {
          title: 'Operations Queue',
          description: 'Active workflows and operation status',
        },
        recentOrders: {
          title: 'Recent Orders',
          description: 'Latest orders and activities',
        },
        lowStock: {
          title: 'Low Stock',
          description: 'Low stock warnings and inventory status',
        },
        activityLog: {
          title: 'Recent Activity',
          subtitle: 'System activity logs',
          description: 'Recent system activities and changes',
          empty: {
            title: 'No activity yet',
            description: 'Order, stock and seller events will appear here.',
          },
          error: {
            title: 'API integration pending',
            description: 'Activities will load from API',
          },
        },
        todaySnapshot: {
          title: 'Today Snapshot',
          description: 'Today\'s summary information',
          columns: {
            today: {
              title: 'Today',
              orders: 'Order count',
              revenue: 'Revenue',
              returns: 'Returns',
            },
            operations: {
              title: 'Operations',
              toPack: 'To pack',
              inTransit: 'In transit',
              delivered: 'Delivered',
            },
            customer: {
              title: 'Customer',
              newRegistration: 'New registration',
              newCompany: 'New company',
              newSeller: 'New seller',
            },
          },
        },
        setup: {
          title: 'Setup Checklist',
          subtitle: 'Get started quickly',
          description: 'Complete initial setup steps',
          progress: 'Progress',
          go: 'Go',
          customize: 'Customize',
          allCompleted: 'All steps completed! 🎉',
          resetAll: 'Reset All',
          steps: {
            'company-info': {
              title: 'Complete company information',
              description: 'Company name, contact and address details',
            },
            'first-product': {
              title: 'Add your first product',
              description: 'Add the first product to your catalog',
            },
            'first-seller': {
              title: 'Add first seller',
              description: 'Create and integrate seller account',
            },
            'fulfillment-settings': {
              title: 'Check shipping/delivery settings',
              description: 'Configure shipping and delivery methods',
            },
            'payment-settings': {
              title: 'Check payment methods',
              description: 'Review payment gateways and settings',
            },
            'customize-dashboard': {
              title: 'Customize dashboard view',
              description: 'Arrange widgets and save views',
            },
          },
        },
      },
      kpi: {
        totalRevenue: 'Total Revenue',
        totalOrders: 'Total Orders',
        pendingOrders: 'Pending Orders',
        lowStock: 'Low Stock',
        growthLabel: 'vs previous month',
        noData: 'No data yet',
      },
      cards: {
        revenueTrend: {
          title: 'Revenue Trend',
          subtitle: 'Last 7 days',
          empty: {
            title: 'No revenue data yet',
            description: 'Revenue trend will appear once orders start coming in.',
            actions: {
              orders: 'Go to Orders',
              products: 'Add Product',
            },
          },
        },
        recentOrders: {
          title: 'Recent Orders',
          subtitle: 'Recent activity',
          empty: {
            title: 'No recent orders',
            description: 'There are no recent orders to display.',
            action: 'Go to Orders',
          },
        },
        operationsQueue: {
          title: 'Operations Queue',
          subtitle: 'Active workflows',
          measurements: 'Measurements Needed',
          measurementsDesc: 'Customer waiting for measurement appointment',
          alterations: 'Alterations in Progress',
          alterationsDesc: 'Dress alterations in progress',
          ready: 'Ready for Pickup',
          readyDesc: 'Customer waiting for pickup',
          empty: {
            title: 'No operations yet',
            description: 'Measurement, alteration, and delivery statuses will appear here as orders come in.',
            action: 'Configure workflow',
          },
        },
        lowStock: {
          title: 'Low Stock Warnings',
          subtitle: 'Requires attention',
          empty: {
            title: 'All stocks sufficient',
            description: 'No low stock warnings at the moment.',
          },
          viewAll: 'View All',
          noSku: 'No SKU',
          unit: 'units',
          badge: 'Low Stock',
        },
        fulfillmentSplit: {
          title: 'Fulfillment Split',
          subtitle: 'Fulfillment breakdown',
          shipping: 'Shipping',
          pickup: 'Store Pickup',
          empty: {
            title: 'No analytics yet',
            description: 'Fulfillment analytics will appear here once orders are processed.',
          },
        },
        topProducts: {
          title: 'Top Selling Products',
          salesUnit: 'sales',
          empty: {
            title: 'No analytics yet',
            description: 'Top selling products will appear here once sales start coming in.',
          },
        },
        productionSnapshot: {
          title: 'Today at Atelier',
          subtitle: 'Active production and preparation status',
          sewing: 'In Sewing',
          fittingPending: 'Fitting Pending',
          readyForDelivery: 'Ready for Delivery',
          delayed: 'Delayed Work',
          footerNote: 'Daily atelier status will appear here',
        },
      },
      alerts: {
        lowStock: {
          message: 'Low stock products available',
        },
        pendingPack: {
          message: 'Orders waiting to be packed',
        },
        pendingPayment: {
          message: 'Orders with pending payment',
        },
        sellerApproval: {
          message: 'Products awaiting seller approval',
        },
        actionButton: 'Go',
      },
      snapshot: {
        title: 'Today Snapshot',
        description: 'Today\'s summary information',
        columns: {
          today: {
            title: 'Today',
            orders: 'Order count',
            revenue: 'Revenue',
            returns: 'Returns',
          },
          operations: {
            title: 'Operations',
            toPack: 'To pack',
            inTransit: 'In transit',
            delivered: 'Delivered',
          },
          customer: {
            title: 'Customer',
            newRegistration: 'New registration',
            newCompany: 'New company',
            newSeller: 'New seller',
          },
        },
      },
      activity: {
        title: 'Recent Activity',
        subtitle: 'Recent system activities',
        empty: {
          title: 'No activity yet',
          description: 'Order, product, seller and customer events will appear here. Visit related pages to get started.',
          actions: {
            orders: 'Orders',
            products: 'Products',
            sellers: 'Sellers',
            customers: 'Customers',
          },
        },
      },
      shortcuts: {
        title: 'Quick Shortcuts',
        description: 'Quick access to frequently used pages',
        noPermission: 'You do not have permission to access this page',
        items: {
          orders: {
            title: 'Orders',
            description: 'View and manage all orders',
          },
          products: {
            title: 'Products',
            description: 'View and edit product catalog',
          },
          sellers: {
            title: 'Sellers',
            description: 'Manage seller accounts',
          },
          customersIndividual: {
            title: 'Individual Customers',
            description: 'View individual customer records',
          },
          customersCompany: {
            title: 'Company Customers',
            description: 'View company customer records',
          },
        },
      },
      glance: {
        title: 'At-a-glance',
        description: 'Today\'s key metrics',
        items: {
          revenueToday: {
            label: 'Revenue Today',
          },
          newOrders: {
            label: 'New Orders',
          },
          pendingPayments: {
            label: 'Pending Payments',
          },
          lowStock: {
            label: 'Low Stock',
          },
        },
      },
      operational: {
        recentOrders: {
          title: 'Recent Orders',
          description: 'Recent activity (will load from API)',
          empty: {
            title: 'No orders yet',
            description: 'Orders will appear here',
          },
          error: {
            title: 'Loading error',
            description: 'An error occurred while loading orders',
            retry: 'Retry',
          },
        },
        todo: {
          title: 'Today\'s Tasks',
          description: 'Tasks requiring action',
          empty: {
            title: 'Nothing to do today',
            description: 'All tasks completed',
          },
        },
      },
      checklist: {
        title: 'Operations Checklist',
        subtitle: 'Daily operation tasks',
        progressLabel: 'Completed today: {completed} / {total}',
        items: {
          morningReview: 'Morning status review',
          orderProcessing: 'Order processing check',
          inventoryCheck: 'Inventory check and update',
          customerFollowup: 'Customer follow-up',
          sellerCoordination: 'Seller coordination',
          endOfDayReport: 'End of day report',
        },
      },
      quickActions: {
        title: 'Quick Actions',
        description: 'Quick access to frequently used actions',
        actions: {
          newProduct: {
            label: 'New Product',
            description: 'Add product to catalog',
          },
          newOrder: {
            label: 'New Order',
            description: 'Create manual order',
          },
          newSeller: {
            label: 'New Seller',
            description: 'Add seller account',
          },
          fulfillmentQueue: {
            label: 'Fulfillment Queue',
            description: 'Packaging and shipping',
          },
        },
      },
      empty: {
        kpi: {
          title: 'No data',
          description: 'KPI data has not been loaded yet',
          cta: 'Refresh',
        },
        activity: {
          title: 'No activity yet',
          description: 'Recent activities will appear here',
          cta: 'Go to Orders',
        },
        orders: {
          title: 'No orders yet',
          description: 'Orders will appear here',
          cta: 'Go to Orders',
        },
        revenue: {
          title: 'No revenue data',
          description: 'Revenue trend data has not been loaded yet',
          cta: 'Go to Orders',
        },
        alerts: {
          title: 'No action required',
          description: 'All systems are operating normally',
          cta: 'View Details',
        },
        glance: {
          title: 'No summary data',
          description: 'Status summary data has not been loaded yet',
          cta: 'Refresh',
        },
      },
      error: {
        title: 'Loading error',
        description: 'An error occurred while loading data',
        retry: 'Retry',
      },
      cta: {
        viewOrders: 'Go to Orders',
        viewProducts: 'Go to Products',
        viewSellers: 'Go to Sellers',
        viewCustomers: 'Go to Customers',
        refresh: 'Refresh',
        retry: 'Retry',
      },
    },
    orders: {
      savedViews: {
        label: 'Views',
        default: 'All Orders',
        presetsLabel: 'Preset Views',
        custom: 'Custom Views',
        presets: {
          todayFittings: 'Today Fittings',
          due7Days: 'Due in 7 Days',
          overdue: 'Overdue',
          measurementPending: 'Measurement Pending',
        },
        saveCurrent: 'Save current filters',
      },
      deliveryInfo: {
        title: 'Delivery Information',
        dueDate: 'Due Date',
        deliveryMethod: 'Delivery Method',
        shipping: 'Shipping',
        storePickup: 'Store Pickup',
        overdueWarning: 'This order is past its due date',
        dueSoonWarning: 'Due date is approaching',
        empty: 'No delivery information yet',
      },
    },
    commandPalette: {
      placeholder: 'Search commands or open page...',
      empty: 'No results found',
      navigate: 'Navigate',
      select: 'Select',
      close: 'Close',
      groups: {
        navigation: 'Navigation',
        quickFilters: 'Quick Filters',
      },
      commands: {
        dashboard: {
          title: 'Dashboard',
        },
        orders: {
          title: 'Orders',
        },
        products: {
          title: 'Products',
        },
        customersIndividual: {
          title: 'Customers (Individual)',
        },
        customersCompany: {
          title: 'Customers (Company)',
        },
        sellers: {
          title: 'Sellers',
        },
        lowStock: {
          title: 'Low Stock',
          description: 'Show low stock products',
        },
        pendingPayment: {
          title: 'Pending Payment',
          description: 'Show orders with pending payment',
        },
        toPack: {
          title: 'To Pack',
          description: 'Orders waiting to be packed',
        },
      },
    },
    activity: {
      actions: {
        'order.update': 'Order status updated',
        'order.create': 'New order created',
        'order.delete': 'Order deleted',
        'product.update': 'Product information updated',
        'product.create': 'New product added',
        'product.delete': 'Product deleted',
        'seller.create': 'New seller added',
        'seller.update': 'Seller information updated',
        'seller.delete': 'Seller deleted',
        'settings.update': 'Settings updated',
        'view.save': 'Dashboard view saved',
        'view.delete': 'Dashboard view deleted',
        'customer.create': 'New customer added',
        'customer.update': 'Customer information updated',
      },
    },
    sellers: {
      create: {
        button: 'New Seller',
        title: 'Add New Seller',
        description: 'Create a new seller account',
        submit: 'Save',
        cancel: 'Cancel',
        fields: {
          name: {
            label: 'Seller Name',
            placeholder: 'e.g., ABC Store',
          },
          contactName: {
            label: 'Contact Name',
            placeholder: 'e.g., John Doe',
          },
          phone: {
            label: 'Phone',
            placeholder: 'e.g., +1 555 123 4567',
          },
          email: {
            label: 'Email',
            placeholder: 'example@email.com',
          },
          city: {
            label: 'City',
            placeholder: 'e.g., New York',
          },
          status: {
            label: 'Status',
            options: {
              active: 'Active',
              inactive: 'Inactive',
            },
          },
        },
        messages: {
          pending: 'Will be saved',
          pendingDescription: 'API integration pending',
        },
      },
    },
    products: {
      create: {
        button: 'New Product',
      },
    },
    customers: {
      create: {
        button: 'New Customer',
      },
    },
    forms: {
      submitting: 'Saving...',
      validation: {
        required: 'This field is required',
        minLength: 'Must be at least {min} characters',
        email: 'Please enter a valid email address',
        numberMin: 'Value must be at least {min}',
      },
      unsavedChanges: {
        title: 'Unsaved Changes',
        description: 'Your information will be lost if you leave without saving.',
        continue: 'Continue',
        stay: 'Stay',
      },
    },
    bulkActions: {
      selectedCount: '{count} items selected',
      clear: 'Clear',
      orders: {
        updateStatus: 'Update Status',
      },
      products: {
        updateStock: 'Update Stock',
      },
      sellers: {
        changeStatus: 'Change Status',
      },
    },
  },
}

const savedLocale = localStorage.getItem('locale') || 'tr'
const initialLocale = savedLocale === 'tr' || savedLocale === 'en' ? savedLocale : 'tr'

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'tr',
  messages,
})

export function setLocale(locale: 'tr' | 'en') {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}
