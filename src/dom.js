import { format, differenceInDays, parseISO } from 'date-fns';
import projects from './projects';

const dom = (() => {
    const body = document.querySelector('body');
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('main');
    const projectsList = document.querySelector('.sidebar-projects-list');
    const tasksList = document.querySelector('.todo-item-list');
    const projectModal = document.querySelector('#project-modal');
    const taskModal = document.querySelector('#task-modal');
    const confirmModal = document.querySelector('#confirm-modal');
    const modals = document.querySelectorAll('.modal');
    const projectForm = document.querySelector('#project-form');
    const taskForm = document.querySelector('#task-form');
    const formProjectTitleError = document.querySelector('.project-title-error');
    const formTaskTitleError = document.querySelector('.task-title-error');
    const formTaskProjectError = document.querySelector('.task-project-error');

    function responsiveSidebar() {
        if(window.innerWidth <= 960){
            
        }
        else{

        }
    }
})();



export default dom;