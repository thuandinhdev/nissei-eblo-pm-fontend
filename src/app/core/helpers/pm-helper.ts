/**
 *    Returns array of objects helper function used in projects status, tasks, incidents, users, holidays etc.
 *
 */

//--
// Projects
export const project_status_key_value = [];
project_status_key_value[1] = 'common.status.open';
project_status_key_value[2] = 'common.status.in_progress';
project_status_key_value[3] = 'common.status.on_hold';
project_status_key_value[4] = 'common.status.cancel';
project_status_key_value[5] = 'common.status.completed';

export const project_status_key_class = [];
project_status_key_class[1] = 'open';
project_status_key_class[2] = 'in_progress';
project_status_key_class[3] = 'on_hold';
project_status_key_class[4] = 'cancel';
project_status_key_class[5] = 'completed';

// --
// Tasks
export const task_status_key_value = [];
task_status_key_value[1] = 'common.status.open';
task_status_key_value[2] = 'common.status.in_progress';
task_status_key_value[3] = 'common.status.on_hold';
task_status_key_value[4] = 'common.status.waiting';
task_status_key_value[5] = 'common.status.cancel';
task_status_key_value[6] = 'common.status.completed';

export const task_status_key_class = [];
task_status_key_class[1] = 'open';
task_status_key_class[2] = 'in_progress';
task_status_key_class[3] = 'on_hold';
task_status_key_class[4] = 'waiting';
task_status_key_class[5] = 'cancel';
task_status_key_class[6] = 'completed';

export const task_priority_key_value = [];
task_priority_key_value[1] = 'common.priorities.urgent';
task_priority_key_value[2] = 'common.priorities.very_high';
task_priority_key_value[3] = 'common.priorities.high';
task_priority_key_value[4] = 'common.priorities.medium';
task_priority_key_value[5] = 'common.priorities.low';

// --
// Defects
export const defect_status_key_value = [];
defect_status_key_value[1] = 'common.status.assigned';
defect_status_key_value[2] = 'common.status.closed';
defect_status_key_value[3] = 'common.status.in_progress';
defect_status_key_value[4] = 'common.status.open';
defect_status_key_value[5] = 'common.status.solved';
defect_status_key_value[6] = 'common.status.reopen';
defect_status_key_value[7] = 'common.status.deferred';

export const defect_status_key_class = [];
defect_status_key_class[1] = 'assigned';
defect_status_key_class[2] = 'closed';
defect_status_key_class[3] = 'in_progress';
defect_status_key_class[4] = 'open';
defect_status_key_class[5] = 'solved';
defect_status_key_class[6] = 'reopen';
defect_status_key_class[7] = 'deferred';

export const defect_severity_key_value = [];
defect_severity_key_value[1] = 'common.priorities.low';
defect_severity_key_value[2] = 'common.priorities.medium';
defect_severity_key_value[3] = 'common.priorities.high';
defect_severity_key_value[4] = 'common.priorities.very_high';
defect_severity_key_value[5] = 'common.priorities.urgent';

// --
// Incidents
export const incident_status_key_value = [];
incident_status_key_value[1] = 'common.status.open';
incident_status_key_value[2] = 'common.status.assigned';
incident_status_key_value[3] = 'common.status.in_progress';
incident_status_key_value[4] = 'common.status.solved';
incident_status_key_value[5] = 'common.status.deferred';
incident_status_key_value[6] = 'common.status.reopen';
incident_status_key_value[7] = 'common.status.closed';

export const incident_status_key_class = [];
incident_status_key_class[1] = 'open';
incident_status_key_class[2] = 'assigned';
incident_status_key_class[3] = 'in_progress';
incident_status_key_class[4] = 'solved';
incident_status_key_class[5] = 'deferred';
incident_status_key_class[6] = 'reopen';
incident_status_key_class[7] = 'closed';

export const incident_severity_key_value = [];
incident_severity_key_value[1] = 'common.priorities.low';
incident_severity_key_value[2] = 'common.priorities.medium';
incident_severity_key_value[3] = 'common.priorities.high';
incident_severity_key_value[4] = 'common.priorities.very_high';
incident_severity_key_value[5] = 'common.priorities.urgent';

// --
// Sprint Status
export const sprint_status_key_value = [];
sprint_status_key_value[1] = 'common.status.open',
    sprint_status_key_value[2] = 'common.status.in_progress',
    sprint_status_key_value[3] = 'common.status.on_hold',
    sprint_status_key_value[4] = 'common.status.cancel',
    sprint_status_key_value[5] = 'common.status.completed';

// --
// Colors
export const colors = {
    red: {
        primary: '#1cbcd8',
        secondary: '#e8fcff'
    },
    blue: {
        primary: '#78e316',
        secondary: '#efffe0'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    },
    green: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    },
    orange: {
        primary: '#50AD15',
        secondary: '#8CC823'
    },
    purple: {
        primary: '#8860C2',
        secondary: '#C57CF5'
    }
};

// --
// Loader exclude URLs
export const stop_loading_url = [
    // environment.apiUrl + '/api/mailbox/unread-emails'
];

// --
// Date formats
export const date_formats = [
    {value: 'DD-MM-YYYY', label: '13-02-2020'},
    {value: 'MM-DD-YYYY', label: '02-13-2020'},
    {value: 'YYYY-MM-DD', label: '2020-02-13'},
    {value: 'D-M-YY', label: '13-2-20'},
    {value: 'DD.MM.YYYY', label: '13.02.2020'},
    {value: 'MM.DD.YYYY', label: '02.13.2020'},
    {value: 'YYYY.MM.DD', label: '2020.02.13'},
    {value: 'D.M.YY', label: '13.2.20'}
];

// --
// Sidebar default background images
export const sidebarBGDefaultImages = [
    {image: 'assets/img/sidebar-bg/01.jpg'},
    {image: 'assets/img/sidebar-bg/02.jpg'},
    {image: 'assets/img/sidebar-bg/03.jpg'},
    {image: 'assets/img/sidebar-bg/04.jpg'},
    {image: 'assets/img/sidebar-bg/05.jpg'},
    {image: 'assets/img/sidebar-bg/06.jpg'}
];

// --
// Sidebar background gradients
export const sidebarBGGradientColors = [
    {value: 'pomegranate-gradient', key: 'pomegranate-gr'},
    {value: 'king-yna-gradient', key: 'king-yna-gr'},
    {value: 'ibiza-sunset-gradient', key: 'ibiza-sunset-gr'},
    {value: 'flickr-gradient', key: 'flickr-gr'},
    {value: 'purple-bliss-gradient', key: 'purple-bliss-gr'},
    {value: 'man-of-steel-gradient', key: 'man-of-steel-gr'},
    {value: 'purple-love-gradient', key: 'man-of-steel-gr'},
];

// --
// Sidebar default backgound colors
export const sidebarBGColors = [
    {key: 'black', value: 'bg-black'},
    {key: 'white', value: 'bg-grey'},
    {key: 'primary', value: 'bg-primary'},
    {key: 'success', value: 'bg-success'},
    {key: 'warning', value: 'bg-warning'},
    {key: 'info', value: 'bg-info'},
    {key: 'danger', value: 'bg-danger'},
];

// --
// Transparent backgound colors
export const transparentBGColors = [
    {key: 'bg-hibiscus', value: 'bg-hibiscus'},
    {key: 'bg-purple-pizzazz', value: 'bg-purple-pizzazz'},
    {key: 'bg-blue-lagoon', value: 'bg-blue-lagoon'},
    {key: 'bg-electric-violet', value: 'bg-electric-violet'},
    {key: 'bg-portage', value: 'bg-portage'},
    {key: 'bg-tundora', value: 'bg-tundora'}
];

// --
// Transparent backgound images
export const transparentBGImages = [
    {image: 'assets/img/gallery/bg_glass_1.jpg', class: 'bg_glass_1'},
    {image: 'assets/img/gallery/bg_glass_2.jpg', class: 'bg_glass_2'},
    {image: 'assets/img/gallery/bg_glass_3.jpg', class: 'bg_glass_3'},
    {image: 'assets/img/gallery/bg_glass_4.jpg', class: 'bg_glass_4'}
];

// --
// Project logos.
export const ProjectLogos = [
    'adobe-illustrator.png',
    'adobe-photoshop.png',
    'android.png',
    'apple.png',
    'creative-commons.png',
    'drive.png',
    'itunes.png',
    'java.png',
    'linux.png',
    'spotify.png',
    'whatsapp.png',
    'windows.png'
];

