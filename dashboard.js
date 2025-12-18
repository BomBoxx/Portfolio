requireAuth();

const apiBase = "https://portfolio-admin-panel-1.onrender.com/admin/projects";
const token = getToken();

const projectsGrid = document.getElementById("projectsGrid");
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const projectTitleInput = document.getElementById("projectTitle");
const projectVideoInput = document.getElementById("projectVideo");
let editingProjectId = null;
let projects = []; // store fetched projects

// Function to render a project card
function renderProject(project) {
  let url = project.video_url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  return `
    <div class="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-xl hover:scale-[1.02] transition">
      <h3 class="text-xl font-bold mb-2">${project.title}</h3>

      <a href="${url}" target="_blank"
         class="text-indigo-400 hover:underline break-all">
        ${project.video_url}
      </a>

      <div class="flex justify-end gap-3 mt-4">
        <button onclick="editProject(${project.id})"
          class="px-4 py-2 rounded-lg bg-yellow-500/90 hover:bg-yellow-600">
          Edit
        </button>
        <button onclick="deleteProject(${project.id})"
          class="px-4 py-2 rounded-lg bg-red-500/90 hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  `;
}


// Fetch projects and render
async function fetchProjects() {
  try {
    const res = await fetch(apiBase, {
      headers: { "Authorization": `Bearer ${token}`, "x_api_key": "mysecretapikey123" }
    });

    if (!res.ok) throw new Error("Failed to fetch projects");

    projects = await res.json();
    projectsGrid.innerHTML = "";

    projects.forEach(p => {
      projectsGrid.innerHTML += renderProject(p);
    });

  } catch (err) {
    console.error("Error fetching projects:", err);
  }
}

// Show modal for adding
document.getElementById("addProjectBtn").addEventListener("click", () => {
  editingProjectId = null;
  modalTitle.textContent = "Add Project";
  projectTitleInput.value = "";
  projectVideoInput.value = "";
  modal.classList.remove("hidden");
});

// Cancel button
document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Save project
document.getElementById("saveBtn").addEventListener("click", async () => {
  const data = {
    title: projectTitleInput.value,
    video_url: projectVideoInput.value
  };

  try {
    if (editingProjectId) {
      // Edit project
      await fetch(`${apiBase}/${editingProjectId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
    } else {
      // Add project
      await fetch(apiBase, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
    }

    modal.classList.add("hidden");
    fetchProjects();

  } catch (err) {
    console.error("Error saving project:", err);
  }
});

// Edit project function
window.editProject = (id) => {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  editingProjectId = id;
  modalTitle.textContent = "Edit Project";
  projectTitleInput.value = project.title;
  projectVideoInput.value = project.video_url;
  modal.classList.remove("hidden");
};

// Delete project function
window.deleteProject = async (id) => {
  if (!confirm("Are you sure you want to delete this project?")) return;

  try {
    await fetch(`${apiBase}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    fetchProjects();
  } catch (err) {
    console.error("Error deleting project:", err);
  }
};

// Initial load
fetchProjects();
