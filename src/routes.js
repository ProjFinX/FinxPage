import React, { lazy } from 'react';

const OneScreen = lazy(() => import("./components/dynamiccontents/LoadScreen"));
//const InboxOneScreen = lazy(() => import("./components/dynamiccontents/InboxRenderScreen"));
const DashBoard = lazy(() => import("./components/Inbox"))
const Company = lazy(() => import("../src/components/company/Company"))
const Branch = lazy(() => import("../src/components/company/Branch"))
const User = lazy(() => import("../src/components/userrole/user"))
const Role = lazy(() => import("../src/components/userrole/role"))
const BranchRoleMapping = lazy(() => import("../src/components/userrole/branchrolemapping"))
const UserRoleMapping = lazy(() => import("../src/components/userrole/userrolemapping"))
const RoleSelect = lazy(() => import("./components/User/RoleSelect"))
const MngMenuRole = lazy(() => import("./components/menumngr/mngmenu"))
const MngStageRole = lazy(() => import("./components/menumngr/mngstagerole"))
const RoleStatusChange = lazy(() => import("./components//userrole/rolestatuschange"))
const UserStatusChange = lazy(() => import("./components//userrole/userstatuschange"))
const CompanySelect = lazy(() => import("./components/User/CompanySelect"))
const ScreenMaster = lazy(() => import("../src/components/dynamicscreendefinition/ScreenMaster"))
const ScreenDefiner = lazy(() => import("../src/components/dynamicscreendefinition/ScreenDefiner"))
const StageMaster = lazy(() => import("../src/components/dynamicscreendefinition/StageMaster"))
const NotFoundPage = lazy(() => import("../src/components/Layout/NotFoundPage"))
const ElementMaster = lazy(() => import("../src/components/dynamicscreendefinition/ElementMaster"))
const StageElementMapping = lazy(() => import("../src/components/dynamicscreendefinition/StageElementMapping"))
const DomainDataMapping = lazy(() => import("../src/components/dynamicscreendefinition/DomainDataMapping"))
const UserProfile = lazy(()=>import("../src/components/User/UserProfile"))
const EvntExprGroup = lazy(() => import("../src/components/dynamicscreendefinition/EvntExprGroup"))	
const EventDefiner = lazy(() => import("../src/components/dynamicscreendefinition/EventDefiner"))	
const EventExpGroupMapping = lazy(() => import("../src/components/dynamicscreendefinition/EventExpGroupMapping"))
const UIDesign = lazy(() => import("../src/components/dynamicscreendefinition/UIDesign"))
const TaskElement = lazy(() => import("../src/components/dynamicscreendefinition/TaskElement"))
const Addmnugroup = lazy(() => import("./components/menumngr/addmnugroup"))
//const CrossBranchStageMapping = lazy(() => import("../src/components/dynamicscreendefinition/CrossBranchStageMapping"))
const SMTPMaster = lazy(() => import("../src/components/CommunicationDefiner/SMTPMaster"))
const MailTemplate = lazy(() => import("../src/components/CommunicationDefiner/MailTemplate"))
const MailTmplAttachment = lazy(() => import("../src/components/CommunicationDefiner/MailTmplAttachment"))
const MailAttchElms = lazy(() => import("../src/components/CommunicationDefiner/MailAttchElms"))



export const MenuRoutes = [
    {
        path: "/",
        component: DashBoard,
        exact: "true"
    },
    {
        path: "/dashboard",
        component: DashBoard,
        exact: "true"
    },
    {
        path: "/onescreen",
        component: OneScreen,
        exact: "true"
    },
    // {
    //     path: "/inboxonescreen",
    //     component: InboxOneScreen,
    //     exact: "true"
    // },

    {
        path: "/Company",
        component: Company,
        exact: "true"
    },
    {
        path: "/Branch",
        component: Branch,

    }
    ,
    {
        path: "/User",
        component: User,

    }
    ,
    {
        path: "/Role",
        component: Role,
    },
    {
        path: "/BranchRoleMapping",
        component: BranchRoleMapping,
    },
    {
        path: "/UserRoleMapping",
        component: UserRoleMapping,
    }
    ,
    {
        path: "/RoleSelect",
        component: RoleSelect,
    }
    ,
    {
        path: "/mngmenu",
        component: MngMenuRole,
    }
    ,
    {
        path: "/mngstagerole",
        component: MngStageRole,
    }
    ,
    {
        path: "/Rolestatuschange",
        component: RoleStatusChange,
    }
    ,
    {
        path: "/Userstatuschange",
        component: UserStatusChange,
    }
    ,
    {
        path: "/CompanySelect",
        component: CompanySelect,
    }

    ,
    {
        path: "/ScreenMaster",
        component: ScreenMaster,
    }
    ,
    {
        path: "/StageMaster",
        component: StageMaster,
    },{
        path: "/ScreenDefiner",
        component: ScreenDefiner,
    },
    {
        path: "*",
        component: NotFoundPage,

    },
    {
        path: "/ElementMaster",
        component: ElementMaster,
    }
    ,
    {
        path: "/StageElementMapping",
        component: StageElementMapping,
    },
    {
        path: "/DomainDataMapping",
        component: DomainDataMapping,
    },
    {
        path:"/UserProfile",
        component:UserProfile
    },
    {	
        path: "/EventDefiner",	
        component: EventDefiner,	
    },
    {	
        path: "/EvntExprGroup",	
        component: EvntExprGroup,	
    },	
    {	
        path: "/EventExpGroupMapping",	
        component:EventExpGroupMapping,	
    },
	    {
        path: "/UIDesign",
        component:UIDesign,
    },
	{
        path: "/TaskElement",
        component:TaskElement,
    },
    {
        path: "/addmnugroup",
        component: Addmnugroup,
    },
    // {
    //     path: "/CrossBranchStageMapping",
    //     component: CrossBranchStageMapping,
    // },
    {
        path: "/SMTPMaster",
        component: SMTPMaster,
    },
    {
        path: "/MailTemplate",
        component: MailTemplate,
    },
    {
        path: "/MailTmplAttachment",
        component: MailTmplAttachment,
    },
    {
        path: "/MailAttchElms",
        component: MailAttchElms,
    }
    
    
]
