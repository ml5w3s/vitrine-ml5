import { AdmComponent } from '../components/AdmComponent.js';

export async function renderAdmView(router) {
    const viewElement = document.createElement('div');
    viewElement.classList.add('adm-view'); // Add a class for styling if needed

    // Instantiate the main administrative component
    const admComponent = new AdmComponent(router);
    const admElement = await admComponent.render();
    viewElement.appendChild(admElement);

    // Clean up any event listeners or resources if needed when the view is destroyed
    viewElement.destroy = () => {
        if (typeof admComponent.destroy === 'function') {
            admComponent.destroy();
        }
    };

    return viewElement;
}
