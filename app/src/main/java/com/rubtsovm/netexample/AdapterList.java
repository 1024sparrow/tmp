package com.rubtsovm.netexample;

import android.content.Context;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.rubtsovm.netexample.net.request.characters.model.Character;
import com.rubtsovm.netexample.net.request.characters.model.CharacterDataWrapper;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;

import rx.Subscriber;

public class AdapterList extends BaseAdapter{

    Context context;
    LayoutInflater layoutInflater;
    ArrayList<Character> characters;

    public AdapterList(Context p_context, ArrayList<Character> p_characters) {
        context = p_context;
        characters = p_characters;
        layoutInflater = (LayoutInflater)context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return characters.size();
    }

    @Override
    public Object getItem(int position) {
        return characters.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        View view = convertView;

        if(view == null){
            view = layoutInflater.inflate(R.layout.item, parent, false);
        }
        Character characters = getCharacter(position);

        String imagePath = characters.getThumbnail().getPath()+ "/standard_xlarge" + ".";
        String imageExtension =  characters.getThumbnail().getExtension();
        String imageUrl = imagePath + imageExtension;

        ImageView imageView = (ImageView)view.findViewById(R.id.item_thumbnail);

        Picasso.get().load(imageUrl).into(imageView);
        ((TextView)view.findViewById(R.id.item_name)).setText(characters.getName());
        return view;
    }

    Character getCharacter(int position){
        return ((Character)getItem(position));
    }
}
