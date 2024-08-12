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
            if(main.classList.contains('main-mobile')){
                return;
            }
            sidebar.classList.remove('sidebar-show');
            sidebar.classList.add('sidebar-hide');
            main.classList.add('main-mobile');
        }
        else{
            sidebar.classList.remove('sidebar-hide');
            sidebar.classList.add('sidebar-show');
            main.classList.remove('main-mobile', 'main-blur');
        }
    }

    function toggleSidebar() {
        if (!sidebar.classList.contains('sidebar-show')) {
            sidebar.classList.remove('sidebar-hide');
            sidebar.classList.add('sidebar-show');
            main.classList.add('main-blur');
        } else if (sidebar.classList.contains('sidebar-show')) {
            sidebar.classList.remove('sidebar-show');
            sidebar.classList.add('sidebar-hide');
            main.classList.remove('main-blur');
        }
    }

    function showProjectModal(modal, index=false) {
        const modalHeading = document.querySelector('.project-modal-title');
        const modalSubmitButton = document.querySelector('#project-button');

        projectForm.reset();
        dom.hideElement(dom.formProjectTitleError);

        projectModal.classList.remove('hide');
        projectModal.classList.add('display');

        if (modal === 'addProject') {
            modalHeading.textContent = 'New project';
            modalSubmitButton.textContent = 'Add';
            modalSubmitButton.classList.remove('edit-project');
            modalSubmitButton.classList.add('add-project');

        } else if (modal === 'editProject') {
            const currentProjectTitle = projects.projectsList[index].title;
            const currentProjectIcon = projects.projectsList[index].icon;
            const currentProjectColor = projects.projectsList[index].color;

            const projectTitle = document.querySelector('#form-project-title');
            const projectIcon = document.querySelector(
                `input[value=${currentProjectIcon}]`,
            );
            const projectColor = document.querySelector(
                `input[value=${currentProjectColor}]`,
            );

            projectTitle.value = currentProjectTitle;
            projectIcon.checked = true;
            projectColor.checked = true;

            modalHeading.textContent = 'Edit project';
            modalSubmitButton.textContent = 'Edit';
            modalSubmitButton.classList.remove('add-project');
            modalSubmitButton.classList.add('edit-project');
        }

    }

    function showTaskModal(modal, projectIndex, taskIndex = false){
        const modalHeading = document.querySelector('.task-modal-title');
        const selectProject = document.querySelector('#select-project');
        const modalSubmitButton = document.querySelector('#task-button');

        taskForm.reset();
        dom.hideElement(dom.formTaskTitleError);
        dom.hideElement(dom.formTaskProjectError);

        taskModal.classList.remove('hide');
        taskModal.classList.add('display');

        if(modal === 'addTask') {
            modalHeading.textContent = 'New task';

            selectProject.innerText = '';
            if (Number.isNaN(projectIndex)) {
                const label = document.createElement('label');
                label.id = 'form-label';
                label.innerText = 'Project *';
                label.setAttribute('for', 'form-task-project');
                selectProject.appendChild(label);

                const select = document.createElement('select');
                select.id = 'form-task-project';
                select.setAttribute('name','task-project');
                selectProject.appendChild(select);

                const option = document.createElement('option');
                option.setAttribute('value','');
                option.selected = true;
                option.disabled = true;
                option.innerText = 'Select project';

                select.appendChild(option);
                for(let i=0; i < projects.projectsList.length; i +=1){
                    const newOption = document.createElement('option');
                    newOption.setAttribute('value', i);
                    newOption.innerText = projects.projectsList[i].title;
                    select.appendChild(newOption);
                }
            }

            modalSubmitButton.textContent = 'Add';
            modalSubmitButton.classList.remove('edit-task');
            modalSubmitButton.classList.add('add-task');
        } else if (modal === 'editTask') {
            const currentTaskTitle = 
                projects.projectsList[projectIndex].tasks[taskIndex].title;
            const currentTaskPriority = 
                projects.projectsList[projectIndex].tasks[taskIndex].priority;
            const currentTaskSchedule = 
                projects.projectsList[projectIndex].tasks[taskIndex].schedule;

            const taskTitle = document.querySelector('#form-task-title');
            const taskPriority = document.querySelector('#form-task-priority');
            const taskSchedule = document.querySelector('#form-task-schedule');

            modalHeading.textContent = 'Edit task';

            taskTitle.value = currentTaskTitle;
            taskPriority.value = currentTaskPriority;
            taskSchedule.value = currentTaskSchedule;
            
            selectProject.innerText = '';
            const label = document.createElement('label');
            label.id = 'form-label';
            label.innerText = 'Project';
            label.setAttribute('for', 'form-task-project');
            selectProject.appendChild(label);

            const select = document.createElement('select');
            select.id = 'form-task-project';
            select.disabled = true;
            selectProject.appendChild(select);

            const option = document.createElement('option');
            option.setAttribute('value','');
            option.selected = true;
            option.innerText = projects.projectsList[projectIndex].title;

            select.appendChild(option);

            modalSubmitButton.textContent = 'Edit';
            modalSubmitButton.classList.remove('add-task');
            modalSubmitButton.classList.add('edit-task');
        }
    }
    function showConfirmModal(modal, projectIndex, taskIndex) {
        const modalHeading = document.querySelector('.confirm-modal-title');
        const modalContent = document.querySelector('.confirm-modal-content');
        const modalSubmitButton = document.querySelector('#confirm-button');
        const modalContentPrefix = document.createTextNode(
            'You are going to remove',
        );
        const modalContentPostfix = document.createTextNode(
            '. This action cannot be undone.',
        );
        const title = document.createElement('span');

        confirmModal.classList.remove('hide');
        confirmModal.classList.add('display');

        title.classList.add('confirm-modal-title');

        modalContent.textContent = '';

        if(modal === 'removeProject') {
            modalHeading.textContent = 'Remove project';
            title.textContent = projects.projectsList[projectIndex].title;
            modalContent.appendChild(modalContentPrefix);
            modalContent.appendChild(title);
            modalContent.appendChild(modalContentPostfix);
            modalSubmitButton.classList.remove('remove-task');
            modalSubmitButton.classList.add('remove-project');

        } else if (modal === 'removeTask') {
            modalHeading.textContent = 'Remove task';
            title.textContent = 
                projects.projectsList[projectIndex].tasks[taskIndex].title;
            modalContent.appendChild(modalContentPrefix);
            modalContent.appendChild(title);
            modalContent.appendChild(modalContentPostfix);
            modalSubmitButton.classList.remove('remove-project');
            modalSubmitButton.classList.add('remove-task');
        }
    }

    function showElement(element) {
        element.classList.remove('hide');
        element.classList.add('display');
    }

    function hideElement(modal) {
        if (Object.prototype.isPrototypeOf.call(NodeList.prototype, modal)) {
            modal.forEach((element) => {
                element.classList.remove('display');
                element.classList.add('hide');
            });
        } else {
            modal.classList.remove('display');
            modal.classList.add('hide');
        }
    }

    function renderProjects() {
        // Create link
        projectsList.textContent = '';
        for(let i=0; i < projects.projectsList.length; i += 1) {
            const projectLink = document.createElement('a');
            projectLink.classList.add('sidebar-project');
            projectLink.setAttribute('href', '#');
            projectLink.setAttribute('data-index', i);
            projectsList.appendChild(projectLink)
            // Create icon
            const projectIcon = document.createElement('i');
            projectIcon.classList.add(
                'far',
                projects.projectsList[i].icon,
                'fa-fw',
                projects.projectsList[i].color,
                'sidebar-project',
                'sidebar-project-icon',
            );
            projectLink.appendChild(projectIcon);
            // create title
            const projectTitle = document.createElement('p');
            projectTitle.classList.add('sidebar-project');
            projectTitle.innerText = projects.projectsList[i].title;
            projectLink.appendChild(projectTitle);
            // create remove icon
            const projectRemoveIcon = document.createElement('i');
            projectRemoveIcon.classList.add(
                'far',
                'fa-trash',
                'remove-project-modal',
            );
            projectLink.appendChild(projectRemoveIcon);
            // create edit icon
            const projectEditIcon = document.createElement('i');
            projectEditIcon.classList.add('far', 'fa-edit', 'edit-project-modal');
            projectLink.appendChild(projectEditIcon);
        }
    }

    function selectLink(projectIndex) {
        const allLinks = document.querySelectorAll(
            'a.sidebar-project, a.sidebar-link',
        );
        const inboxLink = document.querySelector('.link-inbox');
        const todayLink = document.querySelector('.link-today');
        const weekLink = document.querySelector('.link-week');
        const importantLink = document.querySelector('.link-important');
        const completedLink = document.querySelector('.link-completed');
        const projectLinks = document.querySelectorAll('a.sidebar-project');
        allLinks.forEach((elem) => {
            elem.classList.remove('active');
        });
        if(typeof projectIndex === 'number') {
            projectLinks[projectIndex].classList.add('active');
        } else if (projectIndex === 'inbox') {
            inboxLink.classList.add('active');
        } else if (projectIndex === 'today') {
            todayLink.classList.add('active');
        } else if (projectIndex === 'week') {
            weekLink.classList.add('active');
        } else if (projectIndex === 'important') {
            importantLink.classList.add('active');
        } else if (projectIndex === 'completed') {
            completedLink.classList.add('active');
        } 
    }

    function renderHeader(projectIndex) {
        const headerTitle = document.querySelector('.todo-header-title');

        if (typeof projectIndex === 'number') {
            headerTitle.textContent = projects.projectsList[projectIndex].title;
            document.title = `${projects.projectsList[projectIndex].title} - TODO`;
        } else {
            headerTitle.textContent = 
                projectIndex[0].toUpperCase() + projectIndex.substring(1);
            document.title = `${
                projectIndex[0].toUpperCase() + projectIndex.substring(1)
            } - TODO`;
        }
    }

    function renderTasks(projectIndex) {
        let indexStart;
        let indexEnd;
        const currDate = format(new Date(), 'yyyy-MM-dd');

        tasksList.textContent = '';
        
    }
    function changeLink(projectIndex) {
        selectLink(projectIndex);
        renderHeader(projectIndex);
        renderTasks(projectIndex);
    }

    return {
        body,
        projectModal,
        confirmModal,
        modals,
        formProjectTitleError,
        formTaskTitleError,
        formTaskProjectError,
        responsiveSidebar,
        toggleSidebar,
        showProjectModal,
        showTaskModal,
        showConfirmModal,
        showElement,
        hideElement,
        renderProjects,
        renderTasks,
        changeLink,
    };
})();



export default dom;