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


    Context ctx;
    LayoutInflater layoutInflater;
    ArrayList<Character> character;

    public AdapterList(Context context, ArrayList<Character> characters) {
        ctx = context;
        character = characters;
        layoutInflater = (LayoutInflater)ctx.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return character.size();
    }

    @Override
    public Object getItem(int position) {
        return character.get(position);
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
        Character character = getCharacter(position);

        String imagePath = character.getThumbnail().getPath()+ "/standard_xlarge" + ".";
        String imageExtension =  character.getThumbnail().getExtension();
        String imageUrl = imagePath + imageExtension;

        ImageView poster = (ImageView)view.findViewById(R.id.posterImage);

        Picasso.get().load(imageUrl).into(poster);
        ((TextView)view.findViewById(R.id.nameTv)).setText(character.getName());
        //((TextView)view.findViewById(R.id.descriptionTv)).setText(character.getDescription());

        return view;
    }

    Character getCharacter(int position){
        return ((Character)getItem(position));
    }
}
