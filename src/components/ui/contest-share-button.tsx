import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContestShareButtonProps {
  contest: {
    id: string;
    title: string;
    game: string;
    prize_pool: number;
    entry_fee: number;
  };
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export const ContestShareButton: React.FC<ContestShareButtonProps> = ({
  contest,
  className = "",
  variant = "outline"
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?contest=${contest.id}`;
  };

  const shareText = `🎮 ${contest.title} - ${contest.game}\n💰 Prize Pool: ₹${Number(contest.prize_pool).toLocaleString()}\n🎫 Entry Fee: ₹${Number(contest.entry_fee).toLocaleString()}\n\nJoin now and win big! 🏆`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareLink());
      toast({
        title: "Link copied!",
        description: "Contest link has been copied to clipboard",
      });
      setIsOpen(false);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppShare = () => {
    const url = generateShareLink();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${url}`)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleTelegramShare = () => {
    const url = generateShareLink();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
    setIsOpen(false);
  };

  const handleInstagramShare = () => {
    const url = generateShareLink();
    // Instagram doesn't have a direct URL share API, so we copy the link and show instructions
    navigator.clipboard.writeText(`${shareText}\n\n${url}`);
    toast({
      title: "Text copied for Instagram!",
      description: "Paste this in your Instagram story or post",
    });
    setIsOpen(false);
  };

  const handleTwitterShare = () => {
    const url = generateShareLink();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText}\n\n${url}`)}`;
    window.open(twitterUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant}
          className={`bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 ${className}`}
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Contest
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-background/95 backdrop-blur-sm border-white/20">
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTelegramShare} className="cursor-pointer">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16l-1.58 7.44c-.12.533-.432.663-.864.414l-2.4-1.77-1.152 1.106c-.128.128-.236.236-.48.236l.168-2.388 4.332-3.912c.192-.168-.04-.264-.296-.096l-5.352 3.372-2.304-.72c-.504-.156-.516-.504.104-.744l8.996-3.468c.416-.156.78.096.648.744v-.012z"/>
          </svg>
          Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleInstagramShare} className="cursor-pointer">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Twitter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};