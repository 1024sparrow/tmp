package com.rubtsovm.netexample;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.ListView;
import java.util.ArrayList;
import android.widget.AdapterView;
import android.view.View;

import com.rubtsovm.netexample.net.MarvelApi;
import com.rubtsovm.netexample.net.request.characters.model.Character;
import com.rubtsovm.netexample.net.request.characters.model.CharacterDataWrapper;
import com.rubtsovm.netexample.utils.CredentialsUtils;
import com.squareup.picasso.Picasso;

import butterknife.BindView;
import butterknife.ButterKnife;
import rx.Subscriber;
import rx.Subscription;

import rx.schedulers.Schedulers;

import static com.rubtsovm.netexample.utils.CredentialsUtils.public_key;
import static com.rubtsovm.netexample.utils.CredentialsUtils.ts;
import static rx.android.schedulers.AndroidSchedulers.mainThread;

public class ActivityMain extends AppCompatActivity {

    @BindView(R.id.list_characters)
    ListView lvCharacter;

    private ArrayList<Character> characters = new ArrayList<>();
    private Subscription subscription;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);

        MarvelApi marvelApi = MarvelApi.getInstance();
        subscription = marvelApi.getMarvel(ts,public_key, CredentialsUtils.getHash())
            .subscribeOn(Schedulers.io())
            .observeOn(mainThread())
            .subscribe(new Subscriber<CharacterDataWrapper>() {
                @Override
                public void onCompleted() {
                    Log.d("MainActivity", "onCompleted");
                }

                @Override
                public void onError(Throwable e) {
                    Log.e("MainActivity", "onError => " + e.getMessage());
                }

                @Override
                public void onNext(CharacterDataWrapper response) {
                    Log.d("MainActivity", "onNext => " + response);
                    try{
                        if(response.getData().getResults().size() > 0){
                            ArrayList<Character> chs = response.getData().getResults();
                            for (int i = 0 ; i < chs.size() ; i++) {
                                Character ch = chs.get(i);
                                Character candidate = new Character(
                                    ch.getId(),
                                    ch.getName(),
                                    ch.getDescription(),
                                    ch.getThumbnail()
                                );
                                characters.add(candidate);
                            }
                            AdapterList adapterList = new AdapterList(getApplication().getApplicationContext(), characters);
                            lvCharacter.setAdapter(adapterList);
                    }
                    }catch (NullPointerException e){
                        Log.e("ActivityMain", "NullPointerException  => " + e.getMessage());
                    }
                }
            });
        lvCharacter.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                //Intent intent = new Intent(getApplicationContext(), CharacterActivity.class);
                //intent.putExtra("characterId", characters.get(position).getId());
                //startActivity(intent);
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if(subscription != null && !subscription.isUnsubscribed())
            subscription.unsubscribe();
    }

}
