import { motion } from "framer-motion";
import { UserPlus, Gamepad2, Trophy, Wallet, Zap, Shield, Target } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Create your account in under 2 minutes with just your phone number and email",
      icon: UserPlus,
      bgColor: "bg-gradient-to-br from-gaming-blue to-gaming-blue/80",
    },
    {
      number: "2",
      title: "Join Tournament",
      description: "Choose from BGMI, Free Fire, and other popular games. Pay entry fee and start playing",
      icon: Gamepad2,
      bgColor: "bg-gradient-to-br from-gaming-purple to-gaming-purple/80",
    },
    {
      number: "3",
      title: "Play & Win",
      description: "Compete with other players, achieve top ranks, and upload your results with proof",
      icon: Trophy,
      bgColor: "bg-gradient-to-br from-gaming-green to-gaming-green/80",
    },
    {
      number: "4",
      title: "Get Paid",
      description: "Withdraw your winnings instantly to your bank account or UPI. No waiting period!",
      icon: Wallet,
      bgColor: "bg-gradient-to-br from-gaming-orange to-gaming-orange/80",
    },
  ];

  const features = [
    {
      title: "Instant Payouts",
      description: "Get your winnings within minutes of verification",
      icon: Zap,
      color: "text-gaming-orange",
    },
    {
      title: "100% Secure",
      description: "Bank-level security for all transactions",
      icon: Shield,
      color: "text-gaming-green",
    },
    {
      title: "Fair Play",
      description: "Anti-cheat system ensures fair competition",
      icon: Target,
      color: "text-gaming-purple",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/10 via-gaming-blue/5 to-gaming-cyan/10 animate-pulse" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/20 via-transparent to-gaming-blue/20 z-10" />

      {/* Floating Circles */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-4 h-4 bg-gaming-purple rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-gaming-cyan rounded-full opacity-40 animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-gaming-green rounded-full opacity-80 animate-pulse delay-500" />
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-gaming-orange rounded-full opacity-50 animate-pulse delay-1500" />
      </div>

      <div className="container mx-auto relative z-20">
        {/* How It Works Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-gaming font-black mb-6 bg-gradient-to-r from-gaming-green to-gaming-cyan bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start earning money from gaming in just 4 simple steps. It's that easy!
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gaming-cyan rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                {step.number}
              </div>
              
              <div className={`${step.bgColor} border border-white/10 rounded-3xl p-8 text-center hover:shadow-glow transition-all duration-300 hover:scale-105 backdrop-blur-sm h-full`}>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-gaming font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Our Platform Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gaming-blue/20 to-gaming-purple/20 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-gaming font-black text-white mb-4">
              Why Choose Our Platform?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-gaming font-bold text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;