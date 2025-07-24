import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Crown, Medal, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeaderboardSection = () => {
  const navigate = useNavigate();

  const topPlayers = [
    {
      rank: 1,
      name: "ProGamer123",
      earnings: "₹5000",
      wins: 10,
      icon: Crown,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/50",
    },
    {
      rank: 2,
      name: "SniperKing",
      earnings: "₹2000",
      wins: 5,
      icon: Trophy,
      color: "text-gray-400",
      bgColor: "bg-gray-400/20",
      borderColor: "border-gray-400/50",
    },
    {
      rank: 3,
      name: "RushMaster",
      earnings: "₹1000",
      wins: 2,
      icon: Medal,
      color: "text-amber-600",
      bgColor: "bg-amber-600/20",
      borderColor: "border-amber-600/50",
    },
  ];

  return (
    <section id="leaderboard" className="relative py-20 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/10 via-gaming-blue/5 to-gaming-cyan/10 animate-pulse" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/20 via-transparent to-gaming-blue/20 z-10" />

      {/* Floating Circles */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-32 left-20 w-5 h-5 bg-gaming-purple rounded-full opacity-60 animate-pulse delay-300" />
        <div className="absolute top-60 right-32 w-4 h-4 bg-gaming-cyan rounded-full opacity-40 animate-pulse delay-700" />
        <div className="absolute bottom-40 left-1/3 w-6 h-6 bg-gaming-green rounded-full opacity-80 animate-pulse delay-1200" />
        <div className="absolute bottom-60 right-1/4 w-3 h-3 bg-gaming-orange rounded-full opacity-50 animate-pulse delay-900" />
      </div>

      <div className="container mx-auto relative z-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Trophy className="w-8 h-8 text-gaming-orange" />
            <h2 className="text-4xl md:text-5xl font-gaming font-black text-foreground">
              Leaderboard
            </h2>
            <Trophy className="w-8 h-8 text-gaming-orange" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Top performers who dominate the arena and earn the biggest rewards
          </p>
        </motion.div>

        {/* Top 3 Players */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 max-w-6xl mx-auto">
          {topPlayers.map((player, index) => (
            <motion.div
              key={player.rank}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group ${index === 0 ? 'lg:order-2 sm:col-span-2 lg:col-span-1 sm:scale-105 lg:scale-110' : index === 1 ? 'lg:order-1 sm:scale-100 lg:scale-105' : 'lg:order-3 sm:scale-100'}`}
            >
              <div className={`relative bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border-2 ${player.borderColor} rounded-3xl p-8 text-center transition-all duration-700 hover:scale-110 hover:from-white/30 hover:via-white/15 hover:to-white/10 overflow-hidden group-hover:shadow-2xl group-hover:shadow-gaming-purple/40`}>
                
                {/* Premium Glow Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/10 via-gaming-blue/5 to-gaming-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-3xl" />
                
                {/* Floating Particles Effect */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gaming-cyan rounded-full opacity-60 animate-pulse" />
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-gaming-purple rounded-full opacity-40 animate-pulse delay-1000" />
                <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-gaming-green rounded-full opacity-70 animate-pulse delay-500" />
                
                {/* Premium Rank Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className={`relative w-12 h-12 ${player.bgColor} ${player.borderColor} border-3 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-2xl group-hover:scale-125 transition-transform duration-500`}>
                    <span className={`text-lg font-gaming font-black ${player.color} drop-shadow-lg`}>
                      #{player.rank}
                    </span>
                    {/* Rank glow */}
                    <div className={`absolute inset-0 ${player.bgColor} rounded-2xl opacity-30 blur-lg`} />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 pt-4">
                  {/* Premium Trophy Icon */}
                  <div className={`relative w-20 h-20 ${player.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-700 shadow-2xl`}>
                    <player.icon className={`w-10 h-10 ${player.color} drop-shadow-2xl`} />
                    {/* Icon glow effect */}
                    <div className={`absolute inset-0 ${player.bgColor} rounded-3xl opacity-40 blur-xl group-hover:opacity-70 transition-opacity duration-500`} />
                  </div>

                  {/* Luxury Avatar */}
                  <div className="relative w-24 h-24 mx-auto mb-6">
                      <img src="/lovable-uploads/user.png" alt={`${player.name}'s avatar`} className="w-full h-full object-cover rounded-full" />
                    {/* Avatar ring effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gaming-purple via-gaming-blue to-gaming-cyan rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-lg" />
                  </div>

                  {/* Premium Name & Title */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-gaming font-black text-white mb-3 group-hover:text-white/95 transition-colors duration-300 drop-shadow-2xl">
                      {player.name}
                    </h3>
                  </div>
                  
                  {/* Luxury Earnings Display */}
                  <div className="relative bg-gradient-to-br from-gaming-green/30 to-gaming-green/10 backdrop-blur-xl border border-gaming-green/40 rounded-2xl p-6 mb-6 group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-gaming-green/20 via-transparent to-gaming-green/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <p className="text-3xl font-gaming font-black text-gaming-green mb-2 drop-shadow-lg">
                      {player.earnings}
                    </p>
                    <p className="text-sm text-white/80 font-medium tracking-wide">Total Winnings</p>
                    {/* Earnings glow */}
                    <div className="absolute inset-0 bg-gaming-green/20 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 blur-xl" />
                  </div>

                  {/* Premium Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/30 rounded-xl p-4 group-hover:scale-105 transition-transform duration-500 shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-gaming-blue/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <p className="text-2xl font-gaming font-black text-white mb-1 drop-shadow-lg">
                        {player.wins}
                      </p>
                      <p className="text-xs text-white/70 font-medium tracking-wide">Wins</p>
                    </div>
                    <div className="relative bg-gradient-to-br from-gaming-purple/30 to-gaming-purple/10 backdrop-blur-xl border border-gaming-purple/40 rounded-xl p-4 group-hover:scale-105 transition-transform duration-500 shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <p className="text-2xl font-gaming font-black text-gaming-purple mb-1 drop-shadow-lg">
                        {Math.round((player.wins / (player.wins + 50)) * 100)}%
                      </p>
                      <p className="text-xs text-white/70 font-medium tracking-wide">Win Rate</p>
                    </div>
                  </div>
                </div>
                
                {/* Ultra Premium Animated Border for 1st place */}
                {index === 0 && (
                  <>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-lg animate-pulse" />
                    <div className="absolute inset-0 rounded-3xl border-2 border-gradient-to-r border-yellow-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </>
                )}
                
                {/* Premium Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 group-hover:animate-pulse" />
              </div>
            </motion.div>
            ))}
        </div>

        {/* Call to Action Banner - Moved After Ranks */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-primary rounded-3xl p-8 text-center mt-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-gaming font-black text-white mb-4">
            Ready to Climb the Ranks?
          </h3>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Join the competition and prove you have what it takes to be at the top of the leaderboard!
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-white/80 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              Real Money Prizes
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              Fair Competition
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              Instant Payouts
            </div>
          </div>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/gamer-place")}
            className="bg-white text-gaming-purple hover:bg-white/90 font-gaming font-bold text-lg px-8 py-6"
          >
            Go to Gamer Place →
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default LeaderboardSection;