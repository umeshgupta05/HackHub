
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  Link as LinkIcon,
  Twitter,
  Linkedin,
  MessageSquare,
  Copy,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');

  // Fetch hackathon details
  const { data: hackathon, isLoading } = useQuery({
    queryKey: ['hackathon', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hackathons')
        .select('*, profiles!hackathons_created_by_fkey(full_name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch comments separately
  const { data: comments = [] } = useQuery({
    queryKey: ['hackathon-comments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hackathon_comments')
        .select('*, profiles(full_name)')
        .eq('hackathon_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Increment view count
  useEffect(() => {
    if (id) {
      const incrementViews = async () => {
        await supabase.rpc('increment_hackathon_views', { hackathon_id: id });
      };
      incrementViews();
    }
  }, [id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${hackathon?.name} hackathon!`;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: 'Link copied!',
          description: 'The hackathon link has been copied to your clipboard.',
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const getEmbedCode = () => {
    const embedCode = `<iframe src="${window.location.origin}/embed/hackathon/${id}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast({
      title: 'Embed code copied!',
      description: 'The embed code has been copied to your clipboard.',
    });
  };

  const handleComment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please login to post comments.',
      });
      return;
    }

    const { error } = await supabase
      .from('hackathon_comments')
      .insert({
        hackathon_id: id,
        user_id: user.id,
        comment,
      });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to post comment.',
      });
      return;
    }

    setComment('');
    toast({
      title: 'Success',
      description: 'Comment posted successfully!',
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!hackathon) {
    return <div className="flex justify-center items-center min-h-screen">Hackathon not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          {hackathon.image_url && (
            <div className="relative w-full h-64 overflow-hidden rounded-t-lg">
              <img
                src={hackathon.image_url}
                alt={hackathon.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold">
                  {hackathon.name}
                  {hackathon.website_url && (
                    <a
                      href={hackathon.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </CardTitle>
                <p className="text-gray-500 mt-1">{hackathon.college_name}</p>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 text-sm"
              >
                {hackathon.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{new Date(hackathon.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{hackathon.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2" />
                <span>{hackathon.current_participants}/{hackathon.max_participants} Participants</span>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="rules">Rules & Eligibility</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-gray-600">{hackathon.description}</p>
                  
                  {hackathon.prize_pool && (
                    <>
                      <h3 className="text-lg font-semibold mt-4">Prize Pool</h3>
                      <p className="text-gray-600">${hackathon.prize_pool}</p>
                    </>
                  )}
                  
                  {(hackathon.team_size_min || hackathon.team_size_max) && (
                    <>
                      <h3 className="text-lg font-semibold mt-4">Team Size</h3>
                      <p className="text-gray-600">
                        {hackathon.team_size_min || 1} - {hackathon.team_size_max || 'Any'} members
                      </p>
                    </>
                  )}
                  
                  {hackathon.technologies && (
                    <>
                      <h3 className="text-lg font-semibold mt-4">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {hackathon.technologies.map((tech: string) => (
                          <Badge key={tech} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="rules" className="space-y-4">
                <div className="prose max-w-none">
                  {hackathon.eligibility_criteria && (
                    <>
                      <h3 className="text-lg font-semibold">Eligibility Criteria</h3>
                      <p className="text-gray-600">{hackathon.eligibility_criteria}</p>
                    </>
                  )}
                  
                  {hackathon.rules && (
                    <>
                      <h3 className="text-lg font-semibold mt-4">Rules</h3>
                      <p className="text-gray-600">{hackathon.rules}</p>
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="discussion" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={handleComment}>Post</Button>
                  </div>
                  
                  <div className="space-y-4">
                    {comments.map((comment: any) => (
                      <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{comment.profiles?.full_name}</p>
                            <p className="text-gray-600 text-sm">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-6">
              <Button variant="outline" onClick={() => handleShare('twitter')}>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" onClick={() => handleShare('linkedin')}>
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" onClick={() => handleShare('copy')}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" onClick={getEmbedCode}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Embed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HackathonDetails;
