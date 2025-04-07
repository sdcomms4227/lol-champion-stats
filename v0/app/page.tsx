"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample champion data - in a real app, this would come from an API
const champions = [
  { id: "aatrox", name: "Aatrox", role: "Fighter", difficulty: 4, image: "/champions/aatrox.jpg" },
  { id: "ahri", name: "Ahri", role: "Mage", difficulty: 5, image: "/champions/ahri.jpg" },
  { id: "akali", name: "Akali", role: "Assassin", difficulty: 7, image: "/champions/akali.jpg" },
  { id: "alistar", name: "Alistar", role: "Tank", difficulty: 3, image: "/champions/alistar.jpg" },
  { id: "amumu", name: "Amumu", role: "Tank", difficulty: 2, image: "/champions/amumu.jpg" },
  { id: "annie", name: "Annie", role: "Mage", difficulty: 2, image: "/champions/annie.jpg" },
  { id: "ashe", name: "Ashe", role: "Marksman", difficulty: 3, image: "/champions/ashe.jpg" },
  { id: "aurelionsol", name: "Aurelion Sol", role: "Mage", difficulty: 8, image: "/champions/aurelionsol.jpg" },
]

const roles = ["All", "Assassin", "Fighter", "Mage", "Marksman", "Support", "Tank"]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("All")

  const filteredChampions = champions.filter((champion) => {
    const matchesSearch = champion.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "All" || champion.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Hero section with background */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.svg?height=400&width=1200')" }}
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-white">League of Legends</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-yellow-400">Champion Stats</h2>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Champion Search</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search for a champion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Champion categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Champion Roles</h2>
          <Tabs defaultValue="All" onValueChange={setSelectedRole}>
            <TabsList className="bg-slate-700 border border-slate-600">
              {roles.map((role) => (
                <TabsTrigger
                  key={role}
                  value={role}
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900"
                >
                  {role}
                </TabsTrigger>
              ))}
            </TabsList>

            {roles.map((role) => (
              <TabsContent key={role} value={role} className="mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredChampions.map((champion) => (
                    <Card
                      key={champion.id}
                      className="overflow-hidden bg-slate-800 border-slate-700 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20"
                    >
                      <div className="aspect-square relative overflow-hidden bg-slate-700">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={
                              champion.image.startsWith("/champions")
                                ? `/placeholder.svg?height=200&width=200&text=${champion.name}`
                                : champion.image
                            }
                            alt={champion.name}
                            width={200}
                            height={200}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-bold">{champion.name}</h3>
                        <div className="flex justify-between items-center mt-1 text-sm">
                          <span className="text-slate-300">{champion.role}</span>
                          <div className="flex">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <span
                                key={i}
                                className={`w-1 h-3 mx-px rounded-sm ${
                                  i < champion.difficulty ? "bg-yellow-500" : "bg-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredChampions.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    No champions found. Try a different search or category.
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-6">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>
            League of Legends Champion Stats is not endorsed by Riot Games and does not reflect the views or opinions of
            Riot Games or anyone officially involved in producing or managing League of Legends.
          </p>
          <p className="mt-2">
            League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
          </p>
        </div>
      </footer>
    </div>
  )
}

