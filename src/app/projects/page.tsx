import { getAllProjects } from "@/lib/content"
import ProjectsClient from "./projects-client"
import { RainEffect, ParticleBackground, CursorGlow } from "@/components/effects"
import { NeonText } from "@/components/effects"

export default function ProjectsPage() {
  const allProjects = getAllProjects()

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Background Particles */}
      <ParticleBackground 
        opacity={0.3}
        className="fixed inset-0 pointer-events-none z-0"
      />
      
      {/* Rain Effect */}
      <RainEffect 
        opacity={0.4}
        className="fixed inset-0 pointer-events-none z-[1]"
      />

      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0 opacity-15 transition-all duration-1000"
        style={{
          backgroundImage: `url(/Cyberpunk-réa.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-purple-900/20 to-black/90 z-0" />

      {/* Cursor Glow Effect */}
      <CursorGlow 
        className="fixed pointer-events-none z-50 rounded-full blur-3xl transition-all duration-300 opacity-30"
        size={384}
        colors={["#ff00ff", "#00ffff"]}
      />

      {/* Content */}
      <div className="relative z-10 pt-24 pb-8">
        <div className="max-w-7xl mx-auto w-full px-4">
          {/* En-tête avec style cyberpunk */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 font-mono">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,255,0.5)] animate-pulse">
                MES RÉALISATIONS
              </span>
            </h1>
            <p className="text-xl text-cyan-100/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-light">
              Découvrez une sélection de projets qui illustrent ma passion pour le design 
              et mon expertise dans différents domaines créatifs.
            </p>
            
            {/* Ligne décorative cyberpunk */}
            <div className="mt-12 flex justify-center items-center">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>
              <div className="mx-4 w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.8)]"></div>
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60"></div>
            </div>
          </div>

          {/* Contenu avec filtres côté client */}
          <ProjectsClient projects={allProjects} />
        </div>
      </div>
    </div>
  )
} 