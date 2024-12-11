export const Menu = [
    {
        name:"DashBoard",
        fixMenu:true,
        path:"/dashboard",
        childrens:[]
    },
    {
        name:"Customer Onboarding",
        fixMenu:true,
        path:"/OneScreen",
        childrens:[]
    },
    {
        name:"Admin",
        icon:"menu-icon fa fa-cogs",
        path:"/",
        // fixMenu:false,
        childId :"SubAdmin",
        childrens:[
            {
                name:"Company",
                path:"/Company",
                icon:"fa fa-puzzle-piece"
            },
            {
                name:"Branch",
                path:"/Branch",
                icon:"fa fa-id-badge"
            },
            {
                name:"User",
                path:"/User",
                icon:"fa fa-id-badge"
            },
            {
                name:"Role",
                path:"/Role",
                icon:"fa fa-id-badge"
            },
            {
                name:"Branch => Role",
                path:"/BranchRoleMapping",
                icon:"fa fa-id-badge"
            },            
            {
                name:"User => Role",
                path:"/UserRoleMapping",
                icon:"fa fa-id-badge"
            },
           
        ]
    },
]