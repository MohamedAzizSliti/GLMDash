import {Routes} from "@angular/router";

export const content: Routes = [
    {
        path: "dashboard",
        loadChildren: () => import("../../components/dashboard_sales/dashboard_sales.module").then((m) => m.Dashboard_salesModule),
    },
    {
        path: "account",
        loadChildren: () => import("../../components/account/account.module").then((m) => m.AccountModule),
    },
    {
        path: "role",
        loadChildren: () => import("../../components/role/role.module").then((m) => m.RoleModule),
    },
    {
        path: "class",
        loadChildren: () => import("../../components/class/class.module").then((m) => m.ClassModule),
    },    {
        path: "enrollment-courses",
        loadChildren: () => import("../../components/enrollment-courses/enrollment-courses.module").then((m) => m.EnrollmentCoursesModule),
    },
    {
        path: "user",
        loadChildren: () => import("../../components/user/user.module").then((m) => m.UserModule),
    },
    {
        path: "tag",
        loadChildren: () => import("../../components/tag/tag.module").then((m) => m.TagModule),
    },
    {
        path: "blog",
        loadChildren: () => import("../../components/blog/blog.module").then((m) => m.BlogModule),
    },
    {
        path: "page",
        loadChildren: () => import("../../components/page/page.module").then((m) => m.PageModule),
    },
    {
        path: "tax",
        loadChildren: () => import("../../components/tax/tax.module").then((m) => m.TaxModule),
    },
    {
        path: "store",
        loadChildren: () => import("../../components/store/store.module").then((m) => m.StoreModule),
    },
    {
        path: "school",
        loadChildren: () => import("../../components/school/school.module").then((m) => m.SchoolModule),
    },
    {
        path: "category",
        loadChildren: () => import("../../components/category/category.module").then((m) => m.CategoryModule),
    },
    {
        path: "media",
        loadChildren: () => import("../../components/media/media.module").then((m) => m.MediaModule),
    },
    {
        path: "coupon",
        loadChildren: () => import("../../components/coupon/coupon.module").then((m) => m.CouponModule),
    },
    {
        path: "vehicle",
        loadChildren: () => import("../../components/vehicles/vehicles.module").then((m) => m.VehiclesModule),
    },

    {
        path: "geofence",
        loadChildren: () => import("../../components/geofence/geofence.module").then((m) => m.GeofenceModule),
    },
    {
        path: "course",
        loadChildren: () => import("../../components/course/product.module").then((m) => m.ProductModule),
    },
    {
        path: "exam-management",
        loadChildren: () => import("../../components/exam-management/exam-management.module").then((m) => m.ExamManagementModule),
    },
    {
        path: "chapter",
        loadChildren: () => import("../../components/chapter/chapter.module").then((m) => m.ChapterModule),
    },
    {
        path: "currency",
        loadChildren: () => import("../../components/currency/currency.module").then((m) => m.CurrencyModule),
    },
    {
        path: "setting",
        loadChildren: () => import("../../components/setting/setting.module").then((m) => m.SettingModule),
    },
    {
        path: "order-status",
        loadChildren: () => import("../../components/order-status/order-status.module").then((m) => m.OrderStatusModule),
    },
    {
        path: "order",
        loadChildren: () => import("../../components/order/order.module").then((m) => m.OrderModule),
    },
    {
        path: "theme-option",
        loadChildren: () => import("../../components/theme-option/theme-option.module").then((m) => m.ThemeOptionModule),
    },
    {
        path: "theme",
        loadChildren: () => import("../../components/theme/theme.module").then((m) => m.ThemeModule),
    },
    {
        path: "payment-details",
        loadChildren: () => import("../../components/payout-details/payout-details.module").then((m) => m.PaymentDetailsModule),
    },
    {
        path: "review",
        loadChildren: () => import("../../components/review/review.module").then((m) => m.ReviewModule)
    },
    {
        path: "faq",
        loadChildren: () => import("../../components/faq/faq.module").then((m) => m.FaqModule)
    },
    {
        path: "notification",
        loadChildren: () => import("../../components/notification/notification.module").then((m) => m.NotificationModule)
    },
    {
        path: "qna",
        loadChildren: () => import("../../components/questions-answers/questions-answers.module").then((m) => m.QuestionsAnswersModule)
    }
];
