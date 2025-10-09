import { getProjectData, getProjectSlugs, getAllProjects } from "@/lib/content"
import { getProjectTheme, getProjectBackground } from "@/lib/project-themes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProjectEvidenceList } from "@/components/ui/project-evidence"
import { ProjectObjectives, ProjectStrategy } from "@/components/ui/project-objectives"
import { ProjectGallery } from "@/components/ui/project-gallery"
import { CyberpunkBackground } from "@/components/effects"
import "@/styles/cyberpunk-effects.css"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { ArrowLeft, ExternalLink, Download, Calendar, User, Clock, ChevronLeft, ChevronRight, Building, GraduationCap } from "lucide-react"

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    const slugs = getProjectSlugs()
    return slugs.map((slug) => ({
      slug: encodeURIComponent(slug), // Encoder pour correspondre aux URLs
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return [] // Retourner un tableau vide en cas d'erreur
  }
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const project = getProjectData(decodedSlug)
  
  if (!project) {
    return {
      title: "Projet non trouvé",
    }
  }

  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: project.featured_image ? [project.featured_image] : [],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  // Décoder le slug pour gérer les caractères spéciaux
  const decodedSlug = decodeURIComponent(slug)
  const project = getProjectData(decodedSlug)
  
  if (!project) {
    notFound()
  }

  // Obtenir les projets suivant et précédent
  const allProjects = getAllProjects()
  const currentIndex = allProjects.findIndex(p => p.slug === decodedSlug)
  const previousProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  // Obtenir le thème et l'image de fond du projet
  const theme = getProjectTheme(decodedSlug, project.project_type, project.annonceur)
  const backgroundImage = getProjectBackground(decodedSlug, project.featured_image)
  
  return (
    <CyberpunkBackground 
      backgroundImage={backgroundImage}
      showRain={true}
      showParticles={true}
      showCursor={true}
      rainOpacity={theme.rainOpacity}
      particleOpacity={theme.particleOpacity}
      cursorOpacity={theme.cursorOpacity}
    >
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto w-full px-4">
          {/* Navigation de retour */}
          <div className="mb-8 slide-down">
            <Button variant="ghost" asChild className="hologram-btn border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10">
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux projets
              </Link>
            </Button>
          </div>

          {/* Header du projet */}
          <div className="max-w-7xl mx-auto mb-12 slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.isArray(project.project_type) ? (
                project.project_type.map((type, index) => (
                  <Badge key={index} variant="secondary" className={`${theme.badgeClasses.primary} hologram-card`}>
                    {type}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary" className={`${theme.badgeClasses.primary} hologram-card`}>
                  {project.project_type}
                </Badge>
              )}
              {project.annonceur && (
                <Badge variant="outline" className={`${theme.badgeClasses.secondary} hologram-card`}>
                  {project.annonceur}
                </Badge>
              )}
              <Badge variant="outline" className={`${theme.badgeClasses.status} hologram-card`}>
                {project.status}
              </Badge>
              <Badge variant="outline" className={`${theme.badgeClasses.context} flex items-center gap-1 hologram-card`}>
                {project.contexte === 'École' ? <GraduationCap className="h-3 w-3" /> : 
                 project.contexte === 'Client' ? <Building className="h-3 w-3" /> : null}
                {project.contexte}
                {project.contexte === 'Autre' && project.contexte_autre && ` (${project.contexte_autre})`}
              </Badge>
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 font-cyberpunk ${theme.titleClasses}`}>
              {project.title}
            </h1>
            
            <p className={`text-xl mb-8 font-cyberpunk ${theme.descriptionClasses}`}>
              {project.excerpt}
            </p>

            {/* Actions principales */}
            <div className="flex flex-wrap gap-4 slide-right" style={{ animationDelay: "0.4s" }}>
              {project.project_url && (
                <Button asChild className={theme.buttonClasses.primary}>
                  <Link href={project.project_url} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir le projet en ligne
                  </Link>
                </Button>
              )}
              {project.pdf_portfolio && (
                <Button variant="outline" asChild className={theme.buttonClasses.secondary}>
                  <Link href={project.pdf_portfolio} target="_blank">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger le PDF
                  </Link>
                </Button>
              )}
              {project.slug === 'campagne-eco-responsable' && (
                <Button variant="outline" asChild className={theme.buttonClasses.secondary}>
                  <Link href="/newsletter-air-austral.html" target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Voir la Newsletter
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contenu principal */}
              <div className="lg:col-span-2 slide-left" style={{ animationDelay: "0.6s" }}>
                {/* Image principale */}
                {project.featured_image && (
                  <div className="mb-8 rounded-lg overflow-hidden hologram-card border border-cyan-400/30">
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="w-full h-auto object-cover transition-all duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}

                {/* Description du projet */}
                <div className="prose prose-neutral dark:prose-invert max-w-none mb-8 font-cyberpunk prose-cyberpunk">
                  <MDXRemote source={project.body} />
                </div>

                {/* Galerie d'images */}
                <div className="hologram-card border border-purple-400/30 rounded-lg p-6 mb-8">
                  <h3 className="text-2xl font-bold text-purple-400 mb-4 neon-text font-cyberpunk">Galerie</h3>
                  <ProjectGallery 
                    gallery={project.gallery}
                    title=""
                    defaultLayout="justified"
                    showLayoutSwitcher={false}
                    className=""
                  />
                </div>

                {/* Stratégie et ciblage */}
                <div className="hologram-card border border-pink-400/30 rounded-lg p-6 mb-8">
                  <h3 className="text-2xl font-bold text-pink-400 mb-4 neon-text font-cyberpunk">Stratégie & Ciblage</h3>
                  <ProjectStrategy 
                    cibles={project.cibles}
                    strategie_creative={project.strategie_creative}
                    className=""
                  />
                </div>

                {/* Objectifs pédagogiques */}
                <div className="hologram-card border border-cyan-400/30 rounded-lg p-6 mb-8">
                  <h3 className="text-2xl font-bold text-purple-300 mb-4 neon-text-purple font-cyberpunk">Objectifs</h3>
                  <ProjectObjectives 
                    cognitifs={project.objectifs_cognitifs}
                    affectifs={project.objectifs_affectifs}
                    conatifs={project.objectifs_conatifs}
                    className=""
                  />
                </div>

                {/* Preuves du projet */}
                {project.preuves && project.preuves.length > 0 && (
                  <div className="hologram-card border border-purple-400/30 rounded-lg p-6 mb-8">
                    <h3 className="text-2xl font-bold text-purple-400 mb-4 neon-text font-cyberpunk">Preuves & Éléments</h3>
                    <ProjectEvidenceList 
                      evidences={project.preuves}
                      title=""
                      className=""
                    />
                  </div>
                )}

                {/* Landing Page Card - Pour les projets avec landing page */}
                {decodedSlug === 'collaboration-inattendue-kelloggs' && (
                  <div className={`hologram-card border border-${theme.primary}/30 rounded-lg p-6 mb-8 bg-gradient-to-br from-${theme.primary}/5 to-${theme.secondary}/5`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-${theme.primary} to-${theme.secondary} flex items-center justify-center`}>
                        <ExternalLink className="h-4 w-4 text-black" />
                      </div>
                      <h3 className={`text-2xl font-bold text-${theme.primary} font-cyberpunk ${theme.titleClasses}`}>Landing Page Interactive</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className={`bg-black/30 border border-${theme.primary}/20 rounded-lg p-4`}>
                        <h4 className={`text-lg font-semibold text-${theme.secondary} mb-2 font-cyberpunk`}>Qu'est-ce qu'une Landing Page ?</h4>
                        <p className={`text-${theme.text}/80 text-sm leading-relaxed`}>
                          Une landing page est une page web spécialement conçue pour convertir les visiteurs en prospects ou clients. 
                          Elle se concentre sur un objectif unique avec un message clair, des éléments visuels percutants et un appel à l'action précis. 
                          Dans le contexte de ce projet, elle présente l'univers créatif, 
                          les éléments clés et permet une interaction optimale avec les visiteurs.
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className={`flex-1 bg-${theme.primary}/10 border border-${theme.primary}/20 rounded-lg p-3`}>
                          <h5 className={`text-${theme.primary} font-semibold text-sm mb-1 font-cyberpunk`}>Objectif Principal</h5>
                          <p className={`text-${theme.text}/80 text-xs`}>Présenter le projet et engager les visiteurs</p>
                        </div>
                        <div className={`flex-1 bg-${theme.secondary}/10 border border-${theme.secondary}/20 rounded-lg p-3`}>
                          <h5 className={`text-${theme.secondary} font-semibold text-sm mb-1 font-cyberpunk`}>Conversion</h5>
                          <p className={`text-${theme.textSecondary} text-xs`}>Interaction et découverte du contenu</p>
                        </div>
                      </div>

                      <Button asChild className={`w-full ${theme.buttonClasses.primary}`}>
                        <Link href="/kelloggs-artists-collab" target="_blank">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Découvrir la Landing Page Interactive
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar avec informations */}
              <div className="lg:col-span-1 slide-right" style={{ animationDelay: "0.8s" }}>
                <Card className="sticky top-24 hologram-card bg-black/50 border-cyan-400/30 backdrop-filter backdrop-blur-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-cyan-400 neon-text font-cyberpunk">Informations du projet</h3>
                  
                    <div className="space-y-4">
                      {/* Date */}
                      <div className="flex items-center gap-3 p-3 rounded border border-cyan-400/20 bg-cyan-400/5">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        <div>
                          <p className="text-sm font-medium text-cyan-400 font-cyberpunk">Date de création</p>
                          <p className="text-sm text-cyan-300/80">
                            {new Date(project.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Annonceur */}
                      {project.annonceur && (
                        <div className="flex items-center gap-3 p-3 rounded border border-pink-400/20 bg-pink-400/5">
                          <User className="h-4 w-4 text-pink-400" />
                          <div>
                            <p className="text-sm font-medium text-pink-400 font-cyberpunk">Annonceur</p>
                            <p className="text-sm text-pink-300/80">{project.annonceur}</p>
                          </div>
                        </div>
                      )}

                      {/* Contexte */}
                      <div className="flex items-center gap-3 p-3 rounded border border-purple-400/20 bg-purple-400/5">
                        {project.contexte === 'École' ? <GraduationCap className="h-4 w-4 text-purple-400" /> : 
                         project.contexte === 'Client' ? <Building className="h-4 w-4 text-purple-400" /> : 
                         <Clock className="h-4 w-4 text-purple-400" />}
                        <div>
                          <p className="text-sm font-medium text-purple-400 font-cyberpunk">Contexte</p>
                          <p className="text-sm text-purple-300/80">
                            {project.contexte}
                            {project.contexte === 'Autre' && project.contexte_autre && ` (${project.contexte_autre})`}
                          </p>
                        </div>
                      </div>

                      {/* Durée */}
                      {project.duration && (
                        <div className="flex items-center gap-3 p-3 rounded border border-cyan-400/20 bg-cyan-400/5">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          <div>
                            <p className="text-sm font-medium text-cyan-400 font-cyberpunk">Durée</p>
                            <p className="text-sm text-cyan-300/80">{project.duration}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Technologies/Outils */}
                    {project.tools && project.tools.length > 0 && (
                      <>
                        <Separator className="my-6 bg-gradient-to-r from-cyan-400 to-pink-500 h-px" />
                        <div>
                          <h4 className="text-sm font-semibold mb-3 text-purple-400 neon-text font-cyberpunk">Technologies utilisées</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.tools.map((tool) => (
                              <Badge key={tool} variant="outline" className="text-xs border-purple-400/30 text-purple-400 bg-purple-400/10 tech-tag hover:bg-purple-400/20 transition-all duration-300">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Objectifs en mode compact */}
                    <div className="my-6 p-4 border border-purple-400/30 rounded-lg bg-purple-400/5">
                      <h4 className="text-sm font-semibold mb-3 text-purple-300 neon-text-purple font-cyberpunk">Objectifs</h4>
                      <ProjectObjectives 
                        cognitifs={project.objectifs_cognitifs}
                        affectifs={project.objectifs_affectifs}
                        conatifs={project.objectifs_conatifs}
                        title=""
                        compact={true}
                        className=""
                      />
                    </div>

                    {/* Actions */}
                    <Separator className="my-6 bg-gradient-to-r from-pink-400 to-purple-500 h-px" />
                    <div className="space-y-3">
                      {project.project_url && (
                        <Button asChild className="w-full bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold hologram-btn pulse-glow">
                          <Link href={project.project_url} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Voir en ligne
                          </Link>
                        </Button>
                      )}
                      {project.pdf_portfolio && (
                        <Button variant="outline" asChild className="w-full border-purple-400/30 text-purple-400 hover:bg-purple-400/10 hologram-btn">
                          <Link href={project.pdf_portfolio} target="_blank">
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger PDF
                          </Link>
                        </Button>
                      )}
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

          {/* Carte Newsletter spéciale pour RSE Air Austral */}
          {project.slug === 'campagne-eco-responsable' && (
            <div className="max-w-7xl mx-auto mt-16 slide-up" style={{ animationDelay: "1.0s" }}>
              <Card className="hologram-card border border-green-400/30 bg-black/40 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-green-500 mb-6">
                      <ExternalLink className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-400 mb-4 font-cyberpunk">
                      Newsletter Interactive
                    </h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                      Découvrez la newsletter HTML/CSS responsive créée pour ce projet. 
                      Elle présente les initiatives RSE Covoit'Air et Travail Out Caz avec un design moderne 
                      et des call-to-action interactifs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Button asChild className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-8 py-3">
                        <Link href="/newsletter-air-austral.html" target="_blank">
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Voir la Newsletter
                        </Link>
                      </Button>
                      <div className="text-sm text-gray-400">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          Compatible email • Responsive • Design moderne
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation entre projets */}
          <div className="max-w-7xl mx-auto mt-16 slide-up" style={{ animationDelay: "1s" }}>
            <Separator className="mb-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent h-px" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              {/* Projet précédent */}
              <div className="flex-1">
                {previousProject ? (
                  <Button variant="outline" asChild className="h-auto p-4 w-full justify-start hologram-btn border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10">
                    <Link href={`/projects/${previousProject.slug}`}>
                      <div className="flex items-center gap-3">
                        <ChevronLeft className="h-5 w-5 flex-shrink-0" />
                        <div className="text-left">
                          <p className="text-xs text-cyan-400/70 mb-1 font-cyberpunk">Projet précédent</p>
                          <p className="font-medium text-sm text-cyan-400">{previousProject.title}</p>
                        </div>
                      </div>
                    </Link>
                  </Button>
                ) : (
                  <div></div>
                )}
              </div>

              {/* Retour à la grille */}
              <Button variant="ghost" asChild className="hologram-btn border-purple-400/30 text-purple-400 hover:bg-purple-400/10">
                <Link href="/projects" className="font-cyberpunk">
                  Tous les projets
                </Link>
              </Button>

              {/* Projet suivant */}
              <div className="flex-1 flex justify-end">
                {nextProject ? (
                  <Button variant="outline" asChild className="h-auto p-4 w-full justify-end hologram-btn border-pink-400/30 text-pink-400 hover:bg-pink-400/10">
                    <Link href={`/projects/${nextProject.slug}`}>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-pink-400/70 mb-1 font-cyberpunk">Projet suivant</p>
                          <p className="font-medium text-sm text-pink-400">{nextProject.title}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 flex-shrink-0" />
                      </div>
                    </Link>
                  </Button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CyberpunkBackground>
  )
}