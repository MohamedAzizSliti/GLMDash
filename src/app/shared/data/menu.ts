import { Menu } from "../interface/menu.interface";

export const menu: Menu[] = [
  {
    id: 14,
    title: "dashboard",
    path: "/dashboard",
    active: false,
    icon: "ri-home-line",
    type: "sub",
    level: 1,
    permission: ["event.index"]
  },
  {
    id: 5,
    title: "schools",
    active: false,
    icon: "ri-building-4-line",
    type: "sub",
    level: 1,
    acl_permission: ["store.index", "store.create", "vendor_wallet.index", "commission_history.index", "withdraw_request.index"],
    children: [
      {
        parent_id: 5,
        title: "add_school",
        path: "/school/create",
        type: "link",
        level: 2,
        permission: ["store.index", "store.create"]
      },
      {
        parent_id: 5,
        title: "all_school",
        path: "/school",
        type: "link",
        badgeType: 'badge bg-warning text-dark ml-3',
        badgeValue: 0,
        level: 2,
        permission: ["store.index"]
      }
    ],
  },
  {
    id: 12,
    title: "classes",
    path: "/class",
    active: false,
    icon: "ri-home-line",
    type: "sub",
    level: 1,
  },
    {
      id: 2,
      title: "users",
      active: false,
      icon: "ri-contacts-line",
      type: "sub",
      level: 1,
      acl_permission: ["user.index", "user.create", "role.index"],
      children: [
        {
          parent_id: 2,
          title: "add user",
          path: "/user/create",
          type: "link",
          level: 2,
          permission: ["user.index", "user.create"],
        },
        {
          parent_id: 2,
          title: "all users",
          path: "/user",
          type: "link",
          level: 2,
          permission: ["user.index"],
        },
        {
          parent_id: 2,
          title: "role",
          path: "/role",
          type: "link",
          level: 2,
          permission: ["role.index"],
        }
      ],
    },
  // Hidden menu items as requested
  /*
  {
    id: 3,
    title: "courses",
    active: false,
    icon: "ri-store-3-line",
    type: "sub",
    level: 1,
    acl_permission: ["product.index", "product.create", "attribute.index"],
    children: [
      {
        parent_id: 3,
        title: "add_product",
        path: "/course/create",
        type: "link",
        level: 2,
        permission: ["product.index", "product.create"]
      },
      {
        parent_id: 3,
        title: "all_courses",
        path: "/course",
        type: "link",
        badgeType: 'badge bg-warning text-dark ml-3',
        badgeValue: 0,
        level: 2,
        permission: ["product.index"]
      },
      {
        parent_id: 3,
        title: "categories",
        path: "/category",
        type: "link",
        level: 2,
        permission: ["category.index"]
      },
      {
        parent_id: 3,
        title: "chapter",
        path: "/chapter",
        type: "link",
        level: 2,
        permission: ["category.index"]
      },
      {
        parent_id: 3,
        title: "tags",
        path: "/tag",
        type: "link",
        level: 2,
        permission: ["tag.index"]
      },

    ],
  },
  {
    id: 12,
    title: "Enrollment Courses",
    path: "/enrollment-courses",
    active: false,
    icon: "ri-home-line",
    type: "sub",
    level: 1,
  },
  {
    id: 55,
    title: "exam_management",
    active: false,
    icon: "ri-building-4-line",
    type: "sub",
    level: 1,
    acl_permission: ["store.index", "store.create", "vendor_wallet.index", "commission_history.index", "withdraw_request.index"],
    children: [
      {
        parent_id: 55,
        title: "exam",
        path: "/exam-management/exam/select-course",
        type: "link",
        level: 2,
        permission: ["store.index", "store.create"]
      },
      {
        parent_id: 55,
        title: "quiz",
        path: "/exam-management/quiz/select-course",
        type: "link",
        badgeType: 'badge bg-warning text-dark ml-3',
        badgeValue: 0,
        level: 2,
        permission: ["store.index"]
      }
    ],
  },
    {
      id: 7,
      title: "media",
      path: "/media",
      active: false,
      icon: "ri-image-line",
      type: "sub",
      level: 1,
      permission: ["attachment.index"]
    },
    */
    {
      id: 8,
      title: "blog",
      active: false,
      icon: "ri-article-line",
      type: "sub",
      level: 1,
      acl_permission: ["blog.index"],
      children: [
        {
          parent_id: 8,
          title: "all blogs",
          path: "/blog",
          type: "link",
          level: 2,
          permission: ["blog.index"]
        },
        {
          parent_id: 8,
          title: "categories",
          path: "/blog/category",
          type: "link",
          level: 2,
          permission: ["category.index"]
        },
        {
          parent_id: 8,
          title: "tags",
          path: "/blog/tag",
          type: "link",
          level: 2,
          permission: ["tag.index"]
        }
      ],
    },
    {
      id: 20,
      title: "settings",
      path: "/setting",
      active: false,
      icon: "ri-settings-3-line",
      type: "sub",
      level: 1,
      permission: ["setting.index"]
    }
];
