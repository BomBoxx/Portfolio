const apiBase = "http://localhost:8000/admin/projects";
const projectsGrid = document.getElementById("projectsGrid");

function normalizeUrl(url) {
  if (!url.startsWith("http")) return "https://" + url;
  return url;
}

function getYoutubeId(url) {
  try {
    const parsed = new URL(normalizeUrl(url));

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }

    return null;
  } catch {
    return null;
  }
}

function getThumbnail(url) {
  const id = getYoutubeId(url);
  if (!id) return null;

  // Highest quality thumbnail
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function renderProject(project) {
  const videoUrl = normalizeUrl(project.video_url);
  const thumbnail = getThumbnail(project.video_url);

  return `
    <div class="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.03] transition">

      <a href="${videoUrl}" target="_blank" class="relative block aspect-video bg-black">
        ${
          thumbnail
            ? `<img src="${thumbnail}" 
                     class="w-full h-full object-cover group-hover:opacity-80 transition" />`
            : `<div class="flex items-center justify-center h-full text-indigo-400">
                 Open Video →
               </div>`
        }

        <!-- Play Button -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center
                      group-hover:scale-110 transition">
            ▶
          </div>
        </div>
      </a>

      <div class="p-5">
        <h3 class="text-xl font-bold mb-2">${project.title}</h3>

        <a href="${videoUrl}" target="_blank"
           class="text-indigo-400 hover:underline text-sm">
          Watch on YouTube →
        </a>
      </div>
    </div>
  `;
}

async function fetchProjects() {
  try {
    const res = await fetch(apiBase);
    const projects = await res.json();

    projectsGrid.innerHTML = "";
    projects.forEach(p => {
      projectsGrid.innerHTML += renderProject(p);
    });

  } catch (err) {
    console.error("Failed to load portfolio:", err);
  }
}

fetchProjects();
